import ApiServices from '../services/apiServices';

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  return await new ApiServices(event).list();
});
