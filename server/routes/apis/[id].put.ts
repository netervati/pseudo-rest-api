import { H3Event } from 'h3';
import { PutApiValidation } from '~~/server/validations';
import ApiServices from '~~/server/services/apiServices';
import validateProjectKey from '~~/server/lib/validateProjectKey';
import ErrorResponse from '~~/server/utils/errorResponse';

type BodyParams = {
  description?: string;
  projectApiKey: string;
  urlPath?: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const body: BodyParams = await readBody<BodyParams>(event);
  const error = new PutApiValidation(body).validate();

  if (error) {
    throw error;
  }

  return body;
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);
  const projectKeys = await validateProjectKey(event, body.projectApiKey);

  if (body.urlPath) {
    const apis = await new ApiServices(event).findByUrlPath({
      urlPath: body.urlPath,
      projectId: projectKeys[0].project_id,
    });

    if (apis.length > 0) {
      throw ErrorResponse.badRequest('API Endpoint already exists.');
    }
  }

  return await new ApiServices(event).update({
    id: event.context.params.id,
    description: body.description,
    projectId: projectKeys[0].project_id,
    urlPath: body.urlPath,
  });
});
