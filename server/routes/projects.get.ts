import ProjectServices from '../services/projectServices';

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  return await new ProjectServices(event).list();
});
