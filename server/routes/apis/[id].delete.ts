import ApiServices from '~~/server/services/apiServices';
import validateProjectKey from '~~/server/lib/validateProjectKey';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const query = getQuery(event) as QueryParams;
  const projectKeys = await validateProjectKey(event, query.projectApiKey);

  return await new ApiServices(event).delete({
    id: event.context.params.id,
    projectId: projectKeys[0].project_id,
  });
});
