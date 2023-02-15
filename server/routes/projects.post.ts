import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { authValidation, postProjectValidation } from '../validations';
import { BaseError, FailedDatabaseQueryError } from '../errors';
import { Database } from '~~/types/supabase';
import { serverSupabaseClient } from '#supabase/server';

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
  const client = serverSupabaseClient<Database>(event);

  const { data: projects, error: projectError } = await client
    .from('projects')
    .insert({
      id: uuidv4(),
      name,
      description,
      user_id: userId,
    })
    .select();

  if (projectError || projects.length === 0) {
    return new FailedDatabaseQueryError('Failed to create project.');
  }

  const secretKey = generateSecretKey();
  const { data: projectKeys, error: projectKeysError } = await client
    .from('project_keys')
    .insert({
      id: uuidv4(),
      api_key: uuidv4(),
      secret_key: await hashPassword(secretKey),
      project_id: projects[0].id,
      user_id: userId,
      updated_at: Date.now().toString(),
    })
    .select();

  if (projectKeysError || projectKeys.length === 0) {
    return new FailedDatabaseQueryError('Failed to generate project keys.');
  }

  return secretKey[0];
}

async function validate(event: H3Event): Promise<ValidationResult> {
  const eventCopy = structuredClone(event);
  let error = authValidation(eventCopy);

  if (error) {
    return error;
  }

  const body: ProjectBodyParams = await readBody(event);
  error = postProjectValidation(body);

  if (error) {
    return error;
  }
}
