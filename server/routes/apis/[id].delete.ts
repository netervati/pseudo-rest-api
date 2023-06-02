import ApiServices from '~~/server/services/apiServices';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;
  const { projectId } = await extractProjectKey(event, query.projectApiKey);

  const deleted = await new ApiServices(event).delete({
    id: event.context.params.id,
    projectId,
  });

  return deleted;
});
