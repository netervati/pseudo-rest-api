import ProjectServices from '~~/server/services/projectServices';

export default defineEventHandler(async (event) => {
  const deleted = await new ProjectServices(event).delete(
    event.context.params.id
  );

  return deleted;
});
