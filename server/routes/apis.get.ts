import ApiServices from '../services/apiServices';
import extractProjectKey from '../lib/extractProjectKey';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;
  const { projectId } = await extractProjectKey(event, query.projectApiKey);

  const list = await new ApiServices(event).list(projectId);

  return list;
});
