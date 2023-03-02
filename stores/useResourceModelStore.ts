import { Ref } from 'vue';
import { defineStore } from 'pinia';

type ResourceDataType = {
  text: string;
  value: string;
};

type ResourceModelStore = {
  types: Ref<ResourceDataType[]>;
  fetchTypes: () => Promise<void>;
};

export default defineStore('resouce-models', (): ResourceModelStore => {
  const types = ref<ResourceDataType[]>([]);
  const toast = useToast();

  /**
   * A function for fetching projects from the server.
   */
  const fetchTypes = async (): Promise<void> => {
    await $fetch('/resource-data-types', {
      method: 'GET',
      onResponse({ response }) {
        types.value = response._data;
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  return {
    types,
    fetchTypes,
  };
});
