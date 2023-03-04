import { Ref } from 'vue';
import { defineStore } from 'pinia';

type ResourceDataType = {
  text: string;
  value: string;
};

type ResourceDataTypeStore = {
  list: Ref<ResourceDataType[]>;
  clear: () => void;
  fetch: () => Promise<void>;
};

export default defineStore('resource-data-types', (): ResourceDataTypeStore => {
  const list = ref<ResourceDataType[]>([]);
  const toast = useToast();

  /**
   * Resets data in state.
   */
  const clear = () => {
    list.value = [];
  };

  /**
   * A function for fetching resource data types from the server.
   */
  const fetch = async (): Promise<void> => {
    await $fetch('/resource-data-types', {
      method: 'GET',
      onResponse({ response }) {
        list.value = response._data;
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  return {
    list,
    clear,
    fetch,
  };
});
