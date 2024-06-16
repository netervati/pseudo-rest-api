import ModelDataServices from '~~/server/services/modelDataServices';
import extractAppKey from '~~/server/lib/extractAppKey';

type QueryParams = {
  ids: string;
  apiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;

  await extractAppKey(event, query.apiKey);

  const ids = query.ids.split(',');

  await new ModelDataServices(event).bulkDelete({
    ids,
    modelId: event.context.params?.id ?? '',
  });

  return null;
});
