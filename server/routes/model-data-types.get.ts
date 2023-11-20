import { FAKER_OPTIONS } from '../utils/generateModelData';

export default defineEventHandler(() => {
  return Object.values(FAKER_OPTIONS).map((obj) => ({
    text: obj.text,
    value: obj.value,
  }));
});
