import { ModelDataServices, ModelServices } from '../../../services';
import extractAppKey from '~~/server/lib/extractAppKey';

type QueryParams = {
  apiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;

  await extractAppKey(event, query.apiKey);

  const resourceModel = await new ModelServices(event).find(
    event.context.params?.id ?? ''
  );

  const list = await new ModelDataServices(event).list(resourceModel.id);

  return list;
});
