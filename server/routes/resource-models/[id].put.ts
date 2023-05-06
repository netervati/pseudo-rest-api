import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PutResourceModelValidation } from '../../validations';
import { ResourceDataServices, ResourceModelServices } from '../../services';
import ErrorResponse from '../../utils/errorResponse';
import generateResourceData from '~~/server/utils/generateResourceData';
import validateProjectKey from '~~/server/lib/validateProjectKey';

type Structure = {
  id: string;
  default: string | number | boolean;
  name: string;
  type: string;
};

type BodyParams = {
  name?: string;
  projectApiKey: string;
  structure: (Structure & { locked?: boolean })[];
};

function validate(body: BodyParams, event: H3Event): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PutResourceModelValidation(body).validate();

  if (error) {
    throw error;
  }

  const uniqueValues = new Set(body.structure.map((item) => item.name));

  if (uniqueValues.size < body.structure.length) {
    throw ErrorResponse.badRequest('Each model name should be unique.');
  }
}

function buildStructure(body: BodyParams): Structure[] {
  return body.structure.map((item) => {
    const coercedValue = coerce(item.type, item.default);

    if (coercedValue !== null) {
      item.default = coercedValue;
    }

    if (item.locked === true) {
      delete item.locked;

      return item;
    }

    return {
      ...item,
      id: uuidv4(),
    };
  });
}

export default defineEventHandler(async (event) => {
  const body = await readBody<BodyParams>(event);

  validate(body, event);

  const projectKeys = await validateProjectKey(event, body.projectApiKey);
  const structure = buildStructure(body);

  const resourceModel = await new ResourceModelServices(event).update({
    id: event.context.params.id,
    name: body.name,
    structure,
    projectId: projectKeys[0].project_id,
  });

  const resourceData = await new ResourceDataServices(event).list(
    resourceModel.id
  );

  for (let i = 0; i < resourceData.length; i += 1) {
    await new ResourceDataServices(event).update({
      data: generateResourceData(structure, resourceData[i].data),
      id: resourceData[i].id,
    });
  }

  return resourceModel;
});
