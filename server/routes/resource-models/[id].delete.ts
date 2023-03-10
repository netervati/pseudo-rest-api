import { H3Event } from 'h3';
import ErrorResponse from '../../utils/errorResponse';
import { ProjectKeyServices, ResourceModelServices } from '~~/server/services';
import { ProjectKey } from '~~/types/models';

type QueryParams = {
  projectApiKey: string;
};

type Payload = {
  event: H3Event;
  projectKey?: ProjectKey;
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

  const projectKey = await getProjectKey(payload);

  // TODO: Identify whether to delete resource data in this endpoint.
  return await new ResourceModelServices(event).delete({
    id: event.context.params.id,
    projectId: projectKey.project_id,
  });
});

async function getProjectKey({
  event,
  query,
}: Payload): Promise<ProjectKey | never> {
  const projectKeys = await new ProjectKeyServices(event).findByApiKey(
    query.projectApiKey
  );

  if (projectKeys.length === 0) {
    throw ErrorResponse.notFound('Project key does not exist');
  }

  return projectKeys[0];
}
