import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PostApiValidation } from '../validations';
import { ApiRepository, ProjectKeyRepository } from '../repositories';
import { Database } from '~~/types/supabase';

type ApiBodyParams = {
  description?: string;
  urlPath: string;
};

export default defineEventHandler(async (event) => {
  const error = await validate(event);

  if (error) {
    throw error;
  }

  const response = await handleRequest(event);

  if (isNuxtError(response)) {
    throw response;
  }

  return {
    attributes: response,
  };
});

async function handleRequest(
  event: H3Event
): RequestResponse<Database['public']['Tables']['apis']['Row']> {
  const userId = event.context.auth.user.id;
  const { description, projectApiKey, urlPath } = await readBody(event);

  const projectKeys = await new ProjectKeyRepository(event).get(
    {
      api_key: projectApiKey,
    },
    '*, projects(*)'
  );

  if (projectKeys.data === null) {
    return projectKeys.error!;
  }

  const apis = await new ApiRepository(event).insert({
    id: uuidv4(),
    description,
    project_id: projectKeys.data[0].projects.id,
    url_path: urlPath,
    user_id: userId,
  });

  if (apis.data === null) {
    return apis.error!;
  }

  return apis.data[0];
}

async function validate(event: H3Event): Promise<ValidationResult> {
  if (event.context.auth.error) {
    return event.context.auth.error;
  }

  const body = await readBody<ApiBodyParams>(event);
  const error = new PostApiValidation(body).validate();

  if (error) {
    return error;
  }
}
