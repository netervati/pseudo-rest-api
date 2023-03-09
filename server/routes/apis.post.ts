import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PostApiValidation } from '../validations';
import { ApiServices, ProjectKeyServices } from '../services';
import ErrorResponse from '../utils/errorResponse';
import { ProjectKey } from '~~/types/models';

type BodyParams = {
  description?: string;
  projectApiKey: string;
  urlPath: string;
};

type Payload = {
  body: BodyParams;
  event: H3Event;
};

export default defineEventHandler(async (event) => {
  const body: BodyParams = await readBody<BodyParams>(event);

  const payload: Payload = {
    body,
    event,
  };

  validate(payload);

  const projectKey = await getProjectKey(payload);

  const apis = await new ApiServices(event).findByUrlPath({
    urlPath: body.urlPath,
    projectId: projectKey.id,
  });

  if (apis.length > 0) {
    throw ErrorResponse.badRequest('API Endpoint already exists.');
  }

  return await new ApiServices(event).create({
    id: uuidv4(),
    description: body.description,
    project_id: projectKey.project_id,
    url_path: body.urlPath,
  });
});

function validate({ body, event }: Payload): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostApiValidation(body).validate();

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
