import { defineStore } from 'pinia';

type ResourceDataType = {
  text: string;
  value: string;
};

export default defineStore('model-data-types', () => {
  const { data } = useLazyFetch<ResourceDataType[]>('/model-data-types', {
    method: 'GET',
    server: false,
  });

  const list = computed(() => data.value || []);

  return {
    list,
  };
});
