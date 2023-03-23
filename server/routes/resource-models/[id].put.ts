import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PutResourceModelValidation } from '../../validations';
import { ProjectKeyServices, ResourceModelServices } from '../../services';
import ErrorResponse from '../../utils/errorResponse';

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

  const projectKeys = await new ProjectKeyServices(event).findByApiKey(
    body.projectApiKey
  );

  if (projectKeys.length === 0) {
    throw ErrorResponse.notFound('Project key does not exist');
  }

  return await new ResourceModelServices(event).update({
    id: event.context.params.id,
    name: body.name,
    structure: buildStructure(body),
    projectId: projectKeys[0].project_id,
  });
});
