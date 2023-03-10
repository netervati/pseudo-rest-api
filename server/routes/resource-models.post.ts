import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PostResourceModelValidation } from '../validations';
import { ProjectKeyServices, ResourceModelServices } from '../services';
import ErrorResponse from '../utils/errorResponse';
import { ProjectKey, ResourceModel } from '~~/types/models';

type BodyParams = {
  name: string;
  projectApiKey: string;
  structure: {
    default: string | number | boolean;
    name: string;
    type: string;
  }[];
};

type Payload = {
  body: BodyParams;
  event: H3Event;
  projectKey?: ProjectKey;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<BodyParams>(event);
  const payload: Payload = {
    body,
    event,
  };

  validate({ body, event });

  const uniqueValues = new Set(body.structure.map((item) => item.name));

  if (uniqueValues.size < body.structure.length) {
    throw ErrorResponse.badRequest('Each model name should be unique.');
  }

  payload.projectKey = await getProjectKey(payload);

  const resourceModels = await new ResourceModelServices(event).findByName({
    name: payload.body.name,
    projectId: payload.projectKey.project_id,
  });

  if (resourceModels.length > 0) {
    throw ErrorResponse.badRequest('Resource model already exists.');
  }

  return await insertResourceModel(payload);
});

function validate({ body, event }: Payload): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostResourceModelValidation(body).validate();

  if (error) {
    throw error;
  }
}

async function getProjectKey({
  body,
  event,
}: Payload): Promise<ProjectKey | never> {
  const projectKeys = await new ProjectKeyServices(event).findByApiKey(
    body.projectApiKey
  );

  if (projectKeys.length === 0) {
    throw ErrorResponse.notFound('Project key does not exist');
  }

  return projectKeys[0];
}

async function insertResourceModel({
  body,
  event,
  projectKey,
}: Payload): Promise<ResourceModel | never> {
  const structure = body.structure.map((item) => {
    const coercedValue = coerce(item.type, item.default);

    if (coercedValue !== null) {
      item.default = coercedValue;
    }

    return {
      ...item,
      id: uuidv4(),
    };
  });

  const resourceModels = await new ResourceModelServices(event).create({
    id: uuidv4(),
    name: body.name,
    structure,
    project_id: projectKey!.project_id,
  });

  return resourceModels;
}
