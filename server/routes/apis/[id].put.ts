import { H3Event } from 'h3';
import { PutApiValidation } from '~~/server/validations';
import { ApiServices, ResourceModelServices } from '~~/server/services';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type BodyParams = {
  description?: string;
  projectApiKey: string;
  resourceModelId?: string;
  urlPath?: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  const body: BodyParams = await readBody<BodyParams>(event);
  const error = new PutApiValidation(body).validate();

  if (error) {
    throw error;
  }

  return body;
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);
  const { projectId } = await extractProjectKey(event, body.projectApiKey);

  if (body.resourceModelId) {
    await new ResourceModelServices(event).find(body.resourceModelId);
  }

  const updated = await new ApiServices(event).updateUnique({
    id: event.context.params?.id ?? '',
    description: body.description,
    projectId,
    resourceModelId: body.resourceModelId,
    urlPath: body.urlPath,
  });

  return updated;
});
