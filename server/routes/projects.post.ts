import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import shortuuid from 'short-uuid';
import { PostProjectValidation } from '../validations';
import { ProjectKeyRepository, ProjectRepository } from '../repositories';

type ProjectBodyParams = {
  name: string;
  description?: string;
};

export default defineEventHandler(async (event) => {
  await validate(event);

  const response = await handleRequest(event);

  return {
    attributes: {
      secretKey: response,
    },
  };
});

async function handleRequest(event: H3Event): RequestResponse<string> {
  const userId = event.context.auth.user.id;
  const { name, description } = await readBody(event);

  const projects = await new ProjectRepository(event).insert({
    id: uuidv4(),
    name,
    description,
    user_id: userId,
  });

  if (projects.error instanceof Error) {
    return projects.error;
  }

  const secretKey = generateSecretKey();

  const projectKeys = await new ProjectKeyRepository(event).insert({
    id: uuidv4(),
    api_key: shortuuid.generate(),
    secret_key: await hashPassword(secretKey),
    project_id: projects.data![0].id,
    user_id: userId,
  });

  if (projectKeys.error instanceof Error) {
    return projectKeys.error;
  }

  return secretKey;
}

async function validate(event: H3Event): Promise<void | never> {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const body = await readBody<ProjectBodyParams>(event);
  const error = new PostProjectValidation(body).validate();

  if (error) {
    throw error;
  }
}
