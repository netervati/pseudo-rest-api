import { H3Event } from 'h3';
import {
  ProjectKeyRepository,
  ResourceModelRepository,
} from '../repositories/';
import { ProjectKeyWithProject, ResourceModel } from '~~/types/models';

type QueryParams = {
  projectApiKey: string;
};

type Payload = {
  event: H3Event;
  projectKey?: ProjectKeyWithProject;
  query: QueryParams;
};

export default defineEventHandler(async (event) => {
  const payload: Payload = {
    event,
    query: getQuery(event) as QueryParams,
  };

  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  payload.projectKey = await getProjectKey(payload);

  return await getResourceModels(payload);
});

async function getProjectKey({
  event,
  query,
}: Payload): Promise<ProjectKeyWithProject | never> {
  const projectKeys = await new ProjectKeyRepository(event).get(
    {
      api_key: query.projectApiKey,
    },
    '*, projects(*)'
  );

  if (projectKeys.error instanceof Error) {
    throw projectKeys.error;
  }

  return projectKeys.data![0];
}

async function getResourceModels({
  event,
  projectKey,
}: Payload): Promise<ResourceModel[] | never> {
  const resourceModels = await new ResourceModelRepository(event).get({
    is_deleted: false,
    project_id: projectKey!.projects.id,
  });

  if (resourceModels.error instanceof Error) {
    throw resourceModels.error;
  }

  return resourceModels.data!;
}
