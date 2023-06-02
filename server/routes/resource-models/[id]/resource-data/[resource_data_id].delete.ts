import ResourceDataServices from '~~/server/services/resourceDataServices';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;

  await extractProjectKey(event, query.projectApiKey);

  const path = event.context.params;

  const deleted = await new ResourceDataServices(event).delete({
    id: path.resource_data_id,
    resourceModelId: path.id,
  });

  return deleted;
});
