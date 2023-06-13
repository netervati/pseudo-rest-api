import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PutResourceModelValidation } from '../../validations';
import { ResourceDataServices, ResourceModelServices } from '../../services';
import ErrorResponse from '../../utils/errorResponse';
import extractProjectKey from '~~/server/lib/extractProjectKey';
import generateResourceData from '~~/server/utils/generateResourceData';

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

async function validate(event: H3Event): Promise<BodyParams | never> {
  const body = await readBody<BodyParams>(event);
  const error = new PutResourceModelValidation(body).validate();

  if (error) {
    throw error;
  }

  const uniqueValues = new Set(body.structure.map((item) => item.name));

  if (uniqueValues.size < body.structure.length) {
    throw ErrorResponse.badRequest('Each model name should be unique.');
  }

  return body;
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
  const body = await validate(event);
  const { projectId } = await extractProjectKey(event, body.projectApiKey);
  const structure = buildStructure(body);

  const resourceModel = await new ResourceModelServices(event).updateUnique({
    id: event.context.params?.id ?? '',
    name: body.name,
    structure,
    projectId,
  });

  const resourceData = await new ResourceDataServices(event).list(
    resourceModel.id
  );

  const data = [];

  for (let i = 0; i < resourceData.length; i += 1) {
    data.push({
      data: generateResourceData(structure, resourceData[i].data),
      id: resourceData[i].id,
    });
  }

  await new ResourceDataServices(event).bulkUpdate(data);

  return resourceModel;
});
