import { defineStore } from 'pinia';

type ResourceDataType = {
  text: string;
  value: string;
};

export default defineStore('resource-data-types', () => {
  const { data } = useLazyFetch<ResourceDataType[]>('/resource-data-types', {
    method: 'GET',
    query: { projectApiKey: useProjectApiKey() },
    server: false,
  });

  const list = computed(() => data.value || []);

  return {
    list,
  };
});
