import {
  ResourceDataServices,
  ResourceModelServices,
} from '~~/server/services';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type QueryParams = {
  projectApiKey: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as QueryParams;
  const { projectId } = await extractProjectKey(event, query.projectApiKey);

  const resourceModel = await new ResourceModelServices(event).delete({
    id: event.context.params.id,
    projectId,
  });

  await new ResourceDataServices(event).bulkDelete(event.context.params.id);

  return resourceModel;
});
