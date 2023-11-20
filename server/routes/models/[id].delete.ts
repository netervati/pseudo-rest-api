import { ModelServices } from '~~/server/services';
import extractAppKey from '~~/server/lib/extractAppKey';

type QueryParams = {
  apiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;
  const { appId } = await extractAppKey(event, query.apiKey);
  const modelId = event.context.params?.id ?? '';

  const model = await new ModelServices(event).delete({
    id: modelId,
    appId,
  });

  return model;
});
