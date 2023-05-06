import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PostResourceModelValidation } from '../validations';
import ResourceModelServices from '../services/resourceModelServices';
import validateProjectKey from '../lib/validateProjectKey';
import ErrorResponse from '../utils/errorResponse';

type Structure = {
  id: string;
  default: string | number | boolean;
  name: string;
  type: string;
}[];

type BodyParams = {
  name: string;
  projectApiKey: string;
  structure: Structure;
};

function validate(body: BodyParams, event: H3Event): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostResourceModelValidation(body).validate();

  if (error) {
    throw error;
  }

  const uniqueValues = new Set(body.structure.map((item) => item.name));

  if (uniqueValues.size < body.structure.length) {
    throw ErrorResponse.badRequest('Each model name should be unique.');
  }
}

function buildStructure(body: BodyParams): Structure {
  return body.structure.map((item) => {
    const coercedValue = coerce(item.type, item.default);

    if (coercedValue !== null) {
      item.default = coercedValue;
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

  const existingResourceModels = await new ResourceModelServices(
    event
  ).findByName({
    name: body.name,
    projectId: projectKeys[0].project_id,
  });

  if (existingResourceModels.length > 0) {
    throw ErrorResponse.badRequest('Resource model already exists.');
  }

  return await new ResourceModelServices(event).create({
    name: body.name,
    structure: buildStructure(body),
    projectId: projectKeys[0].project_id,
  });
});
