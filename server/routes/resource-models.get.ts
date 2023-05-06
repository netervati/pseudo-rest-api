import ResourceModelServices from '../services/resourceModelServices';
import validateProjectKey from '../lib/validateProjectKey';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const query = getQuery(event) as QueryParams;
  const projectKeys = await validateProjectKey(event, query.projectApiKey);

  return await new ResourceModelServices(event).list(projectKeys[0].project_id);
});
