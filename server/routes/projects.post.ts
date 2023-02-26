import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import shortuuid from 'short-uuid';
import { authValidation, PostProjectValidation } from '../validations';
import { BaseError, FailedDatabaseQueryError } from '../errors';
import { ProjectKeyRepository, ProjectRepository } from '../repositories';

type ProjectBodyParams = {
  name: string;
  description?: string;
};

export default defineEventHandler(async (event) => {
  const validateError = await validate(event);

  if (validateError) {
    throw createError(validateError);
  }

  const response = await handleRequest(event);

  if (response instanceof BaseError) {
    throw createError(response.serialize());
  }

  return {
    attributes: {
      secretKey: response,
    },
  };
});

async function handleRequest(
  event: H3Event
): Promise<Result<string, APIError>> {
  const userId = event.context.auth.user.id;
  const { name, description } = await readBody(event);

  const { data: projects, error: projectError } = await new ProjectRepository(
    event
  ).insert({
    id: uuidv4(),
    name,
    description,
    user_id: userId,
  });

  if (projectError || projects.length === 0) {
    return new FailedDatabaseQueryError('Failed to create project.');
  }

  const secretKey = generateSecretKey();

  const { data: projectKeys, error: projectKeysError } =
    await new ProjectKeyRepository(event).insert({
      id: uuidv4(),
      api_key: shortuuid.generate(),
      secret_key: await hashPassword(secretKey),
      project_id: projects[0].id,
      user_id: userId,
    });

  if (projectKeysError || projectKeys.length === 0) {
    return new FailedDatabaseQueryError('Failed to generate project keys.');
  }

  return secretKey;
}

async function validate(event: H3Event): Promise<ValidationResult> {
  let error = authValidation(event);

  if (error) {
    return error;
  }

  const body = await readBody<ProjectBodyParams>(event);
  error = new PostProjectValidation(body).validate();

  if (error) {
    return error;
  }
}
