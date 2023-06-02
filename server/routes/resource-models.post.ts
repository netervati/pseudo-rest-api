import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PostResourceModelValidation } from '../validations';
import ResourceModelServices from '../services/resourceModelServices';
import extractProjectKey from '../lib/extractProjectKey';
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
  const body = await readBody<BodyParams>(event);
  const error = new PostResourceModelValidation(body).validate();

  if (error) {
    throw error;
  }

  const uniqueValues = new Set(body.structure.map((item) => item.name));

  if (uniqueValues.size < body.structure.length) {
    throw ErrorResponse.badRequest('Each model name should be unique.');
  }

  if (body.structure.length > 20) {
    throw ErrorResponse.badRequest(
      'You have exceeded the allowed number of fields for your Resource Model.'
    );
  }

  return body;
}

function buildStructure(body: BodyParams): Structure {
  let coercedValue = null;

  return body.structure.map((item) => {
    coercedValue = coerce(item.type, item.default);

    if (coercedValue !== null) {
      item.default = coercedValue;
    }

    item.id = uuidv4();

    return item;
  });
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);
  const { projectId } = await extractProjectKey(event, body.projectApiKey);
  const resourceModels = new ResourceModelServices(event);
  const userResourceModels = await resourceModels.list(projectId);

  if (userResourceModels.length >= MAX_RESOURCE_MODELS_ALLOWED) {
    throw ErrorResponse.badRequest(
      'You have exceeded the allowed number of Resource Models.'
    );
  }

  const matchingResourceModels = await resourceModels.findByName({
    name: body.name,
    projectId,
  });

  if (matchingResourceModels.length > 0) {
    throw ErrorResponse.badRequest('Resource model already exists.');
  }

  const created = await resourceModels.create({
    name: body.name,
    structure: buildStructure(body),
    projectId,
  });

  return created;
});
