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
  const resourceModelId = event.context.params?.id ?? '';

  const resourceModel = await new ResourceModelServices(event).delete({
    id: resourceModelId,
    projectId,
  });

  await new ResourceDataServices(event).bulkDelete(resourceModelId);

  return resourceModel;
});
