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

async function validate(event: H3Event): Promise<BodyParams | never> {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const body = await readBody<BodyParams>(event);
  const error = new PostResourceModelValidation(body).validate();

  if (error) {
    throw error;
  }

  const uniqueValues = new Set(body.structure.map((item) => item.name));

  if (uniqueValues.size < body.structure.length) {
    throw ErrorResponse.badRequest('Each model name should be unique.');
  }

  return body;
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
  const body = await validate(event);
  const projectKeys = await validateProjectKey(event, body.projectApiKey);
  const resourceModels = new ResourceModelServices(event);

  if (
    (
      await resourceModels.findByName({
        name: body.name,
        projectId: projectKeys[0].project_id,
      })
    ).length > 0
  ) {
    throw ErrorResponse.badRequest('Resource model already exists.');
  }

  if ((await resourceModels.list(projectKeys[0].project_id)).length >= 5) {
    throw ErrorResponse.badRequest(
      'You have exceeded the allowed number of Resource Models.'
    );
  }

  return await resourceModels.create({
    name: body.name,
    structure: buildStructure(body),
    projectId: projectKeys[0].project_id,
  });
});
