import { H3Event } from 'h3';
import { PutApiValidation } from '~~/server/validations';
import { ApiServices, ResourceModelServices } from '~~/server/services';
import { HTTP_METHOD } from '~~/server/services/types';
import validateProjectKey from '~~/server/lib/validateProjectKey';
import ErrorResponse from '~~/server/utils/errorResponse';

type BodyParams = {
  description?: string;
  method?: HTTP_METHOD;
  projectApiKey: string;
  resourceModelId?: string;
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

    if (apis.length > 0 && apis[0].id !== event.context.params.id) {
      throw ErrorResponse.badRequest('API Endpoint already exists.');
    }
  }

  if (body.resourceModelId) {
    await new ResourceModelServices(event).find(body.resourceModelId);
  }

  return await new ApiServices(event).update({
    id: event.context.params.id,
    description: body.description,
    method: body.method,
    projectId: projectKeys[0].project_id,
    resourceModelId: body.resourceModelId,
    urlPath: body.urlPath,
  });
});
