import ResourceDataServices from '~~/server/services/resourceDataServices';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type QueryParams = {
  ids: string;
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;

  await extractProjectKey(event, query.projectApiKey);

  const ids = query.ids.split(',');

  const deleted = await new ResourceDataServices(event).batchDelete({
    ids,
    resourceModelId: event.context.params?.id ?? '',
  });

  return deleted;
});
