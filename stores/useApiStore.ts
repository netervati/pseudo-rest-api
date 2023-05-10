import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { Api } from '~~/types/models';

type BodyParams = {
  description: string;
  projectApiKey: string;
  resourceModelId: string;
  urlPath: string;
};

type UpdateParams = BodyParams & {
  id: string;
};

type DeleteParams = {
  id: string;
  projectApiKey: string;
};

type Options = {
  onSuccess?: () => void;
};

type ApiStore = {
  list: Ref<Api[]>;
  clear: () => void;
  create: (body: BodyParams, options: Options) => Promise<void>;
  delete: (params: DeleteParams, options?: Options) => Promise<void>;
  fetch: (projectApiKey: string) => Promise<void>;
  update: (body: UpdateParams, options: Options) => Promise<void>;
};

export default defineStore('apis', (): ApiStore => {
  const list = ref<Api[]>([]);
  const toast = useToast();

  /**
   * Resets data in state.
   */
  const clear = () => {
    list.value = [];
  };

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
   * A function for deleting api
   */
  const del = async (
    params: DeleteParams,
    options: Options = {}
  ): Promise<void> => {
    await $fetch(`/apis/${params.id}`, {
      method: 'DELETE',
      query: { projectApiKey: params.projectApiKey },
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the api!');

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
  const fetch = async (projectApiKey: string): Promise<void> => {
    await $fetch('/apis', {
      method: 'GET',
      query: { projectApiKey },
      onResponse({ response }) {
        if (response.status === 200) {
          list.value = response._data;
        }
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  /**
   * A function for updating resource model.
   */
  const update = async (
    body: UpdateParams,
    options: Options
  ): Promise<void> => {
    await $fetch(`/apis/${body.id}`, {
      method: 'PUT',
      body,
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Updated the api!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess();
          }
        }
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  return {
    list,
    clear,
    create,
    delete: del,
    fetch,
    update,
  };
});
