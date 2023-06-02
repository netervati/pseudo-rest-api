import ResourceModelServices from '../services/resourceModelServices';
import extractProjectKey from '../lib/extractProjectKey';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;
  const { projectId } = await extractProjectKey(event, query.projectApiKey);

  const list = await new ResourceModelServices(event).list(projectId);

  return list;
});
