import { NitroFetchOptions } from 'nitropack';
import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { ApiWithResourceModel } from '~~/types/models';

type CreateProps = {
  description: string;
  projectApiKey: string;
  resourceModelId: string;
  urlPath: string;
};

type UpdateProps = CreateProps & {
  id: string;
};

type Options = {
  onSuccess?: () => void;
};

type ApiStore = {
  isLoading: Ref<boolean>;
  list: Ref<ApiWithResourceModel[]>;
  clear: () => void;
  create: (body: CreateProps, options: Options) => Promise<void>;
  delete: (id: string, projectApiKey: string) => Promise<void>;
  fetch: (projectApiKey: string) => Promise<void>;
  update: (body: UpdateProps, options: Options) => Promise<void>;
};

const SERVER_PATH = '/apis';

export default defineStore('apis', (): ApiStore => {
  const isLoading = ref(false);
  const list = ref<ApiWithResourceModel[]>([]);
  const toast = useToast();

  /**
   * Resets data in state.
   */
  const clear = () => {
    list.value = [];
  };

  /**
   * NOTE: This generic type doesn't validate if HTTP Method is
   * allowed for url path correctly. Consider revisting this again.
   */
  const request = async <T extends string = `/_${string}`>(
    path: string,
    config: NitroFetchOptions<T>
  ) => {
    isLoading.value = true;

    await $fetch(path, config).catch((error) =>
      toast.error(error.statusMessage)
    );

    isLoading.value = false;
  };

  /**
   * A function that creates the API.
   *
   * @param body{CreateProps}
   * @param options{Options}
   */
  const create = async (body: CreateProps, options: Options): Promise<void> => {
    await request(SERVER_PATH, {
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
    });
  };

  /**
   * A function that deletes an API.
   *
   * @param id{string}
   * @param projectApiKey{string}
   */
  const del = async (id: string, projectApiKey: string): Promise<void> => {
    await request(`/apis/${id}`, {
      method: 'DELETE',
      query: { projectApiKey },
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the api!');
        }
      },
    });
  };

  /**
   * A function for fetching the APIs from the server.
   *
   * @param projectApiKey{string}
   */
  const fetch = async (projectApiKey: string): Promise<void> => {
    await request(SERVER_PATH, {
      method: 'GET',
      query: { projectApiKey },
      onResponse({ response }) {
        if (response.status === 200) {
          list.value = response._data;
        }
      },
    });
  };

  /**
   * A function for updating an API.
   *
   * @param body{UpdateProps}
   * @param options{Options}
   */
  const update = async (body: UpdateProps, options: Options): Promise<void> => {
    await request(`/apis/${body.id}`, {
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
    });
  };

  return {
    /** PROPERTIES */
    isLoading,
    list,

    /** METHODS */
    clear,
    create,
    delete: del,
    fetch,
    update,
  };
});
