import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PostApiValidation } from '../validations';
import { ApiRepository, ProjectKeyRepository } from '../repositories';
import { Database } from '~~/types/supabase';

type BodyParams = {
  description?: string;
  projectApiKey: string;
  urlPath: string;
};

export default defineEventHandler(async (event) => {
  const payload = {
    body: await readBody<BodyParams>(event),
    event,
  };

  validate(payload);

  const projectKey = await getProjectKey(payload);
  const api = await insertApi(payload, projectKey);

  return {
    attributes: api,
  };
});

type Payload = {
  body: BodyParams;
  event: H3Event;
};

function validate({ event, body }: Payload): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostApiValidation(body).validate();

  if (error) {
    throw error;
  }
}

type ProjectKey = Database['public']['Tables']['project_keys']['Row'] & {
  projects: Database['public']['Tables']['projects']['Row'];
};

async function getProjectKey({
  body,
  event,
}: Payload): Promise<ProjectKey | never> {
  const projectKeys = await new ProjectKeyRepository(event).get(
    {
      api_key: body.projectApiKey,
    },
    '*, projects(*)'
  );

  if (projectKeys.error instanceof Error) {
    throw projectKeys.error;
  }

  return projectKeys.data![0];
}

type Api = Database['public']['Tables']['apis']['Row'];

async function insertApi(
  { body, event }: Payload,
  projectKey: ProjectKey
): Promise<Api | never> {
  const apis = await new ApiRepository(event).insert({
    id: uuidv4(),
    description: body.description,
    project_id: projectKey.projects.id,
    url_path: body.urlPath,
    user_id: event.context.auth.user.id,
  });

  if (apis.error instanceof Error) {
    throw apis.error;
  }

  return apis.data![0];
}
