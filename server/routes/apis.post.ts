import { H3Event } from 'h3';
import { PostApiValidation } from '../validations';
import { ApiServices, ProjectKeyServices } from '../services';
import ErrorResponse from '../utils/errorResponse';
import { ProjectKey } from '~~/types/models';

type BodyParams = {
  description?: string;
  projectApiKey: string;
  urlPath: string;
};

export default defineEventHandler(async (event) => {
  const body: BodyParams = await readBody<BodyParams>(event);

  validate(body, event);

  const projectKey = await getProjectKey(body, event);

  const apis = await new ApiServices(event).findByUrlPath({
    urlPath: body.urlPath,
    projectId: projectKey.id,
  });

  if (apis.length > 0) {
    throw ErrorResponse.badRequest('API Endpoint already exists.');
  }

  return await new ApiServices(event).create({
    description: body.description,
    projectId: projectKey.project_id,
    urlPath: body.urlPath,
  });
});

function validate(body: BodyParams, event: H3Event): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostApiValidation(body).validate();

  if (error) {
    throw error;
  }
}

async function getProjectKey(
  body: BodyParams,
  event: H3Event
): Promise<ProjectKey | never> {
  const projectKeys = await new ProjectKeyServices(event).findByApiKey(
    body.projectApiKey
  );

  if (projectKeys.length === 0) {
    throw ErrorResponse.notFound('Project key does not exist');
  }

  return projectKeys[0];
}
