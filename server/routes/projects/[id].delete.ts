import ProjectServices from '~~/server/services/projectServices';

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  return await new ProjectServices(event).delete(event.context.params.id);
});
