import AppServices from '../services/appServices';

export default defineEventHandler(async (event) => {
  const list = await new AppServices(event).list();

  return list;
});
