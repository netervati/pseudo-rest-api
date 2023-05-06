import { H3Event } from 'h3';
import { PostApiValidation } from '../validations';
import ApiServices from '../services/apiServices';
import validateProjectKey from '../lib/validateProjectKey';
import ErrorResponse from '../utils/errorResponse';

type BodyParams = {
  description?: string;
  projectApiKey: string;
  urlPath: string;
};

function validate(body: BodyParams, event: H3Event): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostApiValidation(body).validate();

  if (error) {
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  const body: BodyParams = await readBody<BodyParams>(event);

  validate(body, event);

  const projectKeys = await validateProjectKey(event, body.projectApiKey);

  const apis = await new ApiServices(event).findByUrlPath({
    urlPath: body.urlPath,
    projectId: projectKeys[0].project_id,
  });

  if (apis.length > 0) {
    throw ErrorResponse.badRequest('API Endpoint already exists.');
  }

  return await new ApiServices(event).create({
    description: body.description,
    projectId: projectKeys[0].project_id,
    urlPath: body.urlPath,
  });
});
