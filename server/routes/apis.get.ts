import { ApiServices, ProjectKeyServices } from '../services/';
import ErrorResponse from '../utils/errorResponse';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;

  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const projectKeys = await new ProjectKeyServices(event).findByApiKey(
    query.projectApiKey
  );

  if (projectKeys.length === 0) {
    throw ErrorResponse.notFound('Project key does not exist');
  }

  return await new ApiServices(event).list(projectKeys[0].project_id);
});
