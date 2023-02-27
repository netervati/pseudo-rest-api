import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { postResourceModelValidation } from '../validations';
import { ProjectKeyRepository, ResourceModelRepository } from '../repositories';
import { Database } from '~~/types/supabase';

type BodyParams = {
  projectApiKey: string;
  structure: {
    [key: string]: {
      type: string;
    };
  };
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
): RequestResponse<Database['public']['Tables']['resource_models']['Row']> {
  const userId = event.context.auth.user.id;
  const { projectApiKey, structure } = await readBody<BodyParams>(event);

  const projectKeys = await new ProjectKeyRepository(event).get(
    {
      api_key: projectApiKey,
    },
    '*, projects(*)'
  );

  if (projectKeys.data === null) {
    return projectKeys.error!;
  }

  const resourceModels = await new ResourceModelRepository(event).insert({
    id: uuidv4(),
    structure,
    project_id: projectKeys.data[0].projects.id,
    user_id: userId,
  });

  if (resourceModels.data === null) {
    return resourceModels.error!;
  }

  return resourceModels.data[0];
}

async function validate(event: H3Event): Promise<ValidationResult> {
  if (event.context.auth.error) {
    return event.context.auth.error;
  }

  const body: BodyParams = await readBody(event);
  const error = postResourceModelValidation({
    structure: body.structure,
  });

  if (error) {
    return error;
  }
}
