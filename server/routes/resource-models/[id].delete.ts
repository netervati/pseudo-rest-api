import { H3Event } from 'h3';
import {
  ProjectKeyRepository,
  ResourceModelRepository,
} from '../../repositories/';
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

  return await deleteResourceModel(payload);
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

// TODO: Identify whether to delete resource data in this endpoint.
async function deleteResourceModel({
  event,
  projectKey,
}: Payload): Promise<ResourceModel | never> {
  const resourceModel = await new ResourceModelRepository(event).delete({
    id: event.context.params.id,
    project_id: projectKey!.projects.id,
  });

  if (resourceModel.error instanceof Error) {
    throw resourceModel.error;
  }

  return resourceModel.data![0];
}
