import { H3Event } from 'h3';
import { PostApiValidation } from '../validations';
import { ApiServices, ResourceModelServices } from '../services';
import validateProjectKey from '../lib/validateProjectKey';
import ErrorResponse from '../utils/errorResponse';

type BodyParams = {
  description?: string;
  projectApiKey: string;
  resourceModelId: string;
  urlPath: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const body: BodyParams = await readBody<BodyParams>(event);
  const error = new PostApiValidation(body).validate();

  if (error) {
    throw error;
  }

  return body;
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);
  const projectKeys = await validateProjectKey(event, body.projectApiKey);
  const apis = new ApiServices(event);

  if (
    (
      await apis.findByUrlPath({
        urlPath: body.urlPath,
        projectId: projectKeys[0].project_id,
      })
    ).length > 0
  ) {
    throw ErrorResponse.badRequest('API Endpoint already exists.');
  }

  if ((await apis.list(projectKeys[0].project_id)).length >= 5) {
    throw ErrorResponse.badRequest(
      'Exceeded allowed creation of API Endpoints.'
    );
  }

  await new ResourceModelServices(event).find(body.resourceModelId);

  return await apis.create({
    description: body.description,
    projectId: projectKeys[0].project_id,
    resourceModelId: body.resourceModelId,
    urlPath: body.urlPath,
  });
});
