import ResourceDataServices from '~~/server/services/resourceDataServices';
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

  const path = event.context.params;

  return await new ResourceDataServices(event).delete({
    id: path.resource_data_id,
    resourceModelId: path.id,
  });
});
