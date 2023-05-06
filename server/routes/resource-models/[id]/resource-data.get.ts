import { ResourceDataServices, ResourceModelServices } from '../../../services';
import ErrorResponse from '../../../utils/errorResponse';
import validateProjectKey from '~~/server/lib/validateProjectKey';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const query = getQuery(event) as QueryParams;
  await validateProjectKey(event, query.projectApiKey);

  const resourceModel = await new ResourceModelServices(event).find(
    event.context.params.id
  );

  if (resourceModel === null) {
    throw ErrorResponse.badRequest('Resource model does not exist.');
  }

  return await new ResourceDataServices(event).list(resourceModel.id);
});
