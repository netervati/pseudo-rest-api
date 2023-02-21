import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { authValidation, postApiValidation } from '../validations';
import { BaseError, FailedDatabaseQueryError } from '../errors';
import { ApiRepository, ProjectKeyRepository } from '../repositories';

type ApiBodyParams = {
  description?: string;
  urlPath: string;
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
    attributes: response,
  };
});

async function handleRequest(
  event: H3Event
): Promise<Result<string, APIError>> {
  const userId = event.context.auth.user.id;
  const { description, projectApiKey, urlPath } = await readBody(event);

  const { data: projectKeys, error: projectKeyError } =
    await new ProjectKeyRepository(event).getWithProject({
      api_key: projectApiKey,
    });

  if (projectKeyError || projectKeys.length === 0) {
    return new FailedDatabaseQueryError(
      'Failed to retrieve project key with project.'
    );
  }

  const { data: apis, error: apiError } = await new ApiRepository(event).insert(
    {
      id: uuidv4(),
      description,
      project_id: projectKeys[0].projects.id,
      url_path: urlPath,
      user_id: userId,
    }
  );

  if (apiError || apis.length === 0) {
    return new FailedDatabaseQueryError('Failed to create api endpoint.');
  }

  return apis[0];
}

async function validate(event: H3Event): Promise<ValidationResult> {
  let error = authValidation(event);

  if (error) {
    return error;
  }

  const body: ApiBodyParams = await readBody(event);
  error = postApiValidation(body);

  if (error) {
    return error;
  }
}
