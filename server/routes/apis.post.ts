import { H3Event } from 'h3';
import { PostApiValidation } from '../validations';
import { ApiServices, ResourceModelServices } from '../services';
import extractProjectKey from '../lib/extractProjectKey';
import ErrorResponse from '../utils/errorResponse';

type BodyParams = {
  description?: string;
  projectApiKey: string;
  resourceModelId: string;
  urlPath: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  const body: BodyParams = await readBody<BodyParams>(event);
  const error = new PostApiValidation(body).validate();

  if (error) {
    throw error;
  }

  return body;
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);
  const { projectId } = await extractProjectKey(event, body.projectApiKey);
  const apis = new ApiServices(event);

  const matchingApiPaths = await apis.findByUrlPath({
    urlPath: body.urlPath,
    projectId,
  });

  if (matchingApiPaths.length > 0) {
    throw ErrorResponse.badRequest('API Endpoint already exists.');
  }

  const list = await apis.list(projectId);

  if (list.length >= MAX_APIS_ALLOWED) {
    throw ErrorResponse.badRequest(
      'You have exceeded the allowed number of API Endpoints.'
    );
  }

  await new ResourceModelServices(event).find(body.resourceModelId);

  const newApi = await apis.create({
    description: body.description,
    projectId,
    resourceModelId: body.resourceModelId,
    urlPath: body.urlPath,
  });

  return newApi;
});
