import { H3Event } from 'h3';
import { authValidation } from '../validations';
import { BaseError, FailedDatabaseQueryError } from '../errors';
import ProjectRepository from '../repositories/projectRepository';

export default defineEventHandler(async (event) => {
  const validateError = validate(event);

  if (validateError) {
    throw createError(validateError);
  }

  const response = await handleRequest(event);

  if (response instanceof BaseError) {
    throw createError(response.serialize());
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
  ).getWithProjectKey(
    {
      is_deleted: false,
    },
    'name, description'
  );

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
