import ProjectServices from '~~/server/services/projectServices';

export default defineEventHandler(async (event) => {
  return await new ProjectServices(event).delete(event.context.params.id);
});
