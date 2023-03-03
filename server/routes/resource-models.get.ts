import { H3Event } from 'h3';
import ResourceModelRepository from '../repositories/resourceModelRepository';
import { ResourceModel } from '~~/types/models';

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  return await getResourceModels(event);
});

async function getResourceModels(
  event: H3Event
): Promise<ResourceModel[] | never> {
  const resourceModels = await new ResourceModelRepository(event).get({
    is_deleted: false,
  });

  if (resourceModels.error instanceof Error) {
    throw resourceModels.error;
  }

  return resourceModels.data!;
}
