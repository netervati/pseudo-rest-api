import { H3Event } from 'h3';
import shortuuid from 'short-uuid';
import { ProjectKeyServices, ProjectServices } from '~~/server/services';
import { PostProjectKeyValidation } from '~~/server/validations';
import validateProjectKey from '~~/server/lib/validateProjectKey';

type BodyParams = {
  projectApiKey: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

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

  const existingProjectKey = await validateProjectKey(
    event,
    body.projectApiKey
  );
  const projectKeys = new ProjectKeyServices(event);

  await projectKeys.delete(existingProjectKey[0].id);

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
