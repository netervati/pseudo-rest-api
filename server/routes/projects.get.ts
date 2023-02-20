import { H3Event } from 'h3';
import { authValidation } from '../validations';
import { BaseError, FailedDatabaseQueryError } from '../errors';
import ProjectRepository from '../repositories/projectRepository';

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
    data: response,
  };
});

async function handleRequest(
  event: H3Event
): Promise<Result<string, APIError>> {
  const { data: projects, error: projectError } = await new ProjectRepository(
    event
  ).get({
    is_deleted: false,
  });

  if (projectError) {
    return new FailedDatabaseQueryError('Failed to retrieve projects.');
  }

  return projects.map((project) => ({ attributes: { ...project } }));
}

function validate(event: H3Event): ValidationResult {
  const error = authValidation(event);

  if (error) {
    return error;
  }
}
