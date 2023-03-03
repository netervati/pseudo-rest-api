import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { ResourceModel } from '~~/types/models';

type BodyParams = {
  name: string;
  projectApiKey: string;
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
  list: Ref<ResourceModel[]>;
  create: (body: BodyParams, options: Options) => Promise<void>;
  fetch: () => Promise<void>;
};

export default defineStore('resouce-models', (): ResourceModelStore => {
  const list = ref<ResourceModel[]>([]);
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
   * A function for fetching resource models from the server.
   */
  const fetch = async (): Promise<void> => {
    await $fetch('/resource-models', {
      method: 'GET',
      onResponse({ response }) {
        list.value = response._data;
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  // Added these ignore comments here since TS is unable
  // to analyze type `Json` in ResourceModel properly.
  // @ts-ignore
  return {
    // @ts-ignore
    list,
    create,
    fetch,
  };
});
