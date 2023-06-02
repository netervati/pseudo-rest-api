export default defineEventHandler(() => {
  return Object.keys(RESOURCE_DATA_TYPES).map((key) => ({
    text: RESOURCE_DATA_TYPES[key],
    value: key,
  }));
});
