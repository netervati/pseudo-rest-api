import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PostApiValidation } from '../validations';
import { ApiRepository, ProjectKeyRepository } from '../repositories';
import { Api, ProjectKeyWithProject } from '~~/types/models';

type BodyParams = {
  description?: string;
  projectApiKey: string;
  urlPath: string;
};

type Payload = {
  body: BodyParams;
  event: H3Event;
  projectKey?: ProjectKeyWithProject;
};

export default defineEventHandler(async (event) => {
  const payload: Payload = {
    body: await readBody<BodyParams>(event),
    event,
  };

  validate(payload);

  payload.projectKey = await getProjectKey(payload);

  await existingApi(payload);

  return await insertApi(payload);
});

function validate({ body, event }: Payload): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostApiValidation(body).validate();

  if (error) {
    throw error;
  }
}

async function getProjectKey({
  body,
  event,
}: Payload): Promise<ProjectKeyWithProject | never> {
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

async function existingApi({
  body,
  event,
  projectKey,
}: Payload): Promise<void | never> {
  const apis = await new ApiRepository(event).get({
    is_deleted: false,
    url_path: body.urlPath,
    project_id: projectKey!.projects.id,
  });

  if (apis.error instanceof Error) {
    throw apis.error;
  }

  if (apis.data!.length > 0) {
    throw createError({
      statusCode: HTTP_STATUS_BAD_REQUEST,
      statusMessage: 'API Endpoint already exists.',
    });
  }
}

async function insertApi({
  body,
  event,
  projectKey,
}: Payload): Promise<Api | never> {
  const apis = await new ApiRepository(event).insert({
    id: uuidv4(),
    description: body.description,
    project_id: projectKey!.projects.id,
    url_path: body.urlPath,
    user_id: event.context.auth.user.id,
  });

  if (apis.error instanceof Error) {
    throw apis.error;
  }

  return apis.data![0];
}
