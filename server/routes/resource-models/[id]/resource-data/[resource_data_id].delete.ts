import ErrorResponse from '../../../../utils/errorResponse';
import { ProjectKeyServices, ResourceDataServices } from '~~/server/services';

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

  const path = event.context.params;

  return await new ResourceDataServices(event).delete({
    id: path.resource_data_id,
    resourceModelId: path.id,
  });
});
