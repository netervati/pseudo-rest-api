import { H3Event } from 'h3';
import { ProjectKeyServices, ResourceModelServices } from '../services';
import ErrorResponse from '../utils/errorResponse';
import { ProjectKey } from '~~/types/models';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;

  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const projectKey = await getProjectKey(event, query);

  return await new ResourceModelServices(event).list(projectKey.project_id);
});

async function getProjectKey(
  event: H3Event,
  query: QueryParams
): Promise<ProjectKey | never> {
  const projectKeys = await new ProjectKeyServices(event).findByApiKey(
    query.projectApiKey
  );

  if (projectKeys.length === 0) {
    throw ErrorResponse.notFound('Project key does not exist');
  }

  return projectKeys[0];
}
