import ModelServices from '../services/modelServices';
import extractAppKey from '../lib/extractAppKey';

type QueryParams = {
  apiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;
  const { appId } = await extractAppKey(event, query.apiKey);
  const list = await new ModelServices(event).list(appId);

  return list;
});
