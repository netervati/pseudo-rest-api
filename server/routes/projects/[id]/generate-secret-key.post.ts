import { H3Event } from 'h3';
import shortuuid from 'short-uuid';
import { ProjectKeyServices, ProjectServices } from '~~/server/services';
import { PostProjectKeyValidation } from '~~/server/validations';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type BodyParams = {
  projectApiKey: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  const body: BodyParams = await readBody<BodyParams>(event);
  const error = new PostProjectKeyValidation(body).validate();

  if (error) {
    throw error;
  }

  return body;
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);

  await new ProjectServices(event).find(event.context.params.id);

  const { projectKey } = await extractProjectKey(event, body.projectApiKey);
  const projectKeys = new ProjectKeyServices(event);

  await projectKeys.delete(projectKey.id);

  const secretKey = generateSecretKey();
  const projectApiKey = shortuuid.generate();

  await projectKeys.create({
    apiKey: projectApiKey,
    projectId: event.context.params.id,
    secretKey: await hashPassword(secretKey),
  });

  return {
    projectApiKey,
    secretKey,
  };
});
