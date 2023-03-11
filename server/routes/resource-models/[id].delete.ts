import ErrorResponse from '../../utils/errorResponse';
import { ProjectKeyServices, ResourceModelServices } from '~~/server/services';

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

  // TODO: Identify whether to delete resource data in this endpoint.
  return await new ResourceModelServices(event).delete({
    id: event.context.params.id,
    projectId: projectKeys[0].project_id,
  });
});
