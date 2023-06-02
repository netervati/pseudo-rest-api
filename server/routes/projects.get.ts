import ProjectServices from '../services/projectServices';

export default defineEventHandler(async (event) => {
  const list = await new ProjectServices(event).list();

  return list;
});
