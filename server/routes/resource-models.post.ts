import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { authValidation, postResourceModelValidation } from '../validations';
import { BaseError, FailedDatabaseQueryError } from '../errors';
import { ProjectKeyRepository, ResourceModelRepository } from '../repositories';

type BodyParams = {
  projectApiKey: string;
  structure: {
    [key: string]: {
      type: string;
    };
  };
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
    attributes: response,
  };
});

async function handleRequest(
  event: H3Event
): Promise<Result<string, APIError>> {
  const userId = event.context.auth.user.id;
  const { projectApiKey, structure } = await readBody<BodyParams>(event);

  const { data: projectKeys, error: projectKeyError } =
    await new ProjectKeyRepository(event).getWithProject({
      api_key: projectApiKey,
    });

  if (projectKeyError || projectKeys.length === 0) {
    return new FailedDatabaseQueryError(
      'Failed to retrieve project key with project.'
    );
  }

  const { data: resourceModels, error: resourceModelError } =
    await new ResourceModelRepository(event).insert({
      id: uuidv4(),
      structure,
      project_id: projectKeys[0].projects.id,
      user_id: userId,
    });

  if (resourceModelError || resourceModels.length === 0) {
    return new FailedDatabaseQueryError('Failed to create resource model.');
  }

  return resourceModels[0];
}

async function validate(event: H3Event): Promise<ValidationResult> {
  let error = authValidation(event);

  if (error) {
    return error;
  }

  const body: BodyParams = await readBody(event);
  error = postResourceModelValidation({
    structure: body.structure,
  });

  if (error) {
    return error;
  }
}
