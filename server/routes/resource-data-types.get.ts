export default defineEventHandler((event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  return Object.keys(RESOURCE_DATA_TYPES).map((key) => ({
    text: RESOURCE_DATA_TYPES[key],
    value: key,
  }));
});
