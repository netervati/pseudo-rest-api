import AppServices from '~~/server/services/appServices';

export default defineEventHandler(async (event) => {
  const deleted = await new AppServices(event).delete(
    event.context.params?.id ?? ''
  );

  return deleted;
});
