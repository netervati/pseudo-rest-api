import { defineStore } from 'pinia';
import { Api } from '~~/types/models';

type BodyParams = {
  description: string;
  projectApiKey: string;
  urlPath: string;
};

type Options = {
  onSuccess?: () => void;
};

type ApiStore = {
  create: (body: BodyParams, options: Options) => Promise<void>;
  fetch: () => Promise<void>;
};

export default defineStore('apis', (): ApiStore => {
  const list = ref<Api[]>([]);
  const toast = useToast();

  /**
   * A function for creating api.
   */
  const create = async (body: BodyParams, options: Options): Promise<void> => {
    await $fetch('/apis', {
      method: 'POST',
      body,
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created an API endpoint!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess();
          }
        }
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  /**
   * A function for fetching apis from the server.
   */
  const fetch = async (): Promise<void> => {
    await $fetch('/apis', {
      method: 'GET',
      onResponse({ response }) {
        if (response.status === 200) {
          list.value = response._data;
        }
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  return {
    create,
    fetch,
  };
});
