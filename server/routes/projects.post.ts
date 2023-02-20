import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import shortuuid from 'short-uuid';
import { authValidation, postProjectValidation } from '../validations';
import { BaseError, FailedDatabaseQueryError } from '../errors';
import { ProjectKeyRepository, ProjectRepository } from '../repositories';

type ProjectBodyParams = {
  name: string;
  description?: string;
};

export default defineEventHandler(async (event) => {
  const validateError = await validate(event);

  if (validateError) {
    throw createError({
      statusCode: validateError.statusCode,
      statusMessage: validateError.statusMessage,
    });
  }

  const response = await handleRequest(event);

  if (response instanceof BaseError) {
    throw createError({
      statusCode: response.statusCode,
      statusMessage: response.statusMessage,
    });
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

  const projectObject = {
    id: uuidv4(),
    name,
    description,
    url_path: shortuuid.generate(),
    user_id: userId,
  };

  if (description !== null) {
    projectObject.description = description;
  }

  const { data: projects, error: projectError } = await new ProjectRepository(
    event
  ).insert(projectObject);

  if (projectError || projects.length === 0) {
    return new FailedDatabaseQueryError('Failed to create project.');
  }

  const secretKey = generateSecretKey();

  const { data: projectKeys, error: projectKeysError } =
    await new ProjectKeyRepository(event).insert({
      id: uuidv4(),
      api_key: uuidv4(),
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

  const body: ProjectBodyParams = await readBody(event);
  error = postProjectValidation(body);

  if (error) {
    return error;
  }
}
