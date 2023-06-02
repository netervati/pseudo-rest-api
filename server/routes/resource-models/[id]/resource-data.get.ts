import { ResourceDataServices, ResourceModelServices } from '../../../services';
import ErrorResponse from '../../../utils/errorResponse';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;

  await extractProjectKey(event, query.projectApiKey);

  const resourceModel = await new ResourceModelServices(event).find(
    event.context.params.id
  );

  if (resourceModel === null) {
    throw ErrorResponse.badRequest('Resource model does not exist.');
  }

  const list = await new ResourceDataServices(event).list(resourceModel.id);

  return list;
});
