import {
  ResourceDataServices,
  ResourceModelServices,
} from '~~/server/services';
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

  const resourceModel = await new ResourceModelServices(event).delete({
    id: event.context.params.id,
    projectId: projectKeys[0].project_id,
  });

  await new ResourceDataServices(event).bulkDelete(event.context.params.id);

  return resourceModel;
});
