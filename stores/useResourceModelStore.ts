import { Ref } from 'vue';
import { defineStore } from 'pinia';

type ResourceDataType = {
  text: string;
  value: string;
};

type BodyParams = {
  name: string;
  structure: {
    default: string;
    id: number;
    name: string;
    type: string;
  }[];
};

type Options = {
  onSuccess?: () => void;
};

type ResourceModelStore = {
  types: Ref<ResourceDataType[]>;
  create: (body: BodyParams, options: Options) => Promise<void>;
  fetchTypes: () => Promise<void>;
};

export default defineStore('resouce-models', (): ResourceModelStore => {
  const types = ref<ResourceDataType[]>([]);
  const toast = useToast();

  /**
   * A function for creating resource model.
   */
  const create = async (body: BodyParams, options: Options): Promise<void> => {
    await $fetch('/resource-models', {
      method: 'POST',
      body,
      onResponse() {
        toast.success('Created a resource model!');

        if (typeof options.onSuccess === 'function') {
          options.onSuccess();
        }
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

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
    create,
    fetchTypes,
  };
});
