import { H3Event } from 'h3';
import { PostApiValidation } from '../validations';
import { ApiServices, ResourceModelServices } from '../services';
import extractProjectKey from '../lib/extractProjectKey';

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

  await new ResourceModelServices(event).find(body.resourceModelId);

  const created = await new ApiServices(event).createUnique({
    description: body.description,
    projectId,
    resourceModelId: body.resourceModelId,
    urlPath: body.urlPath,
  });

  return created;
});
