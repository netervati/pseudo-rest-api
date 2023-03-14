import { ResourceDataServices, ResourceModelServices } from '../../../services';
import ErrorResponse from '../../../utils/errorResponse';

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const resourceModel = await new ResourceModelServices(event).find(
    event.context.params.id
  );

  if (resourceModel === null) {
    throw ErrorResponse.badRequest('Resource model does not exist.');
  }

  return await new ResourceDataServices(event).list(resourceModel.id);
});
