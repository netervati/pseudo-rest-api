import { Ref } from 'vue';
import { defineStore } from 'pinia';
import useBaseRequest from './useBaseRequest';
import { ApiWithResourceModel } from '~~/types/models';

type CreateProps = {
  description: string;
  resourceModelId: string;
  urlPath: string;
};

type UpdateProps = CreateProps & {
  id: string;
};

type Options = {
  mutateCache?: boolean;
  onSuccess?: () => void | Promise<() => void>;
};

type ApiStore = {
  isLoading: Ref<boolean>;
  list: Ref<ApiWithResourceModel[]>;
  clear: () => void;
  create: (body: CreateProps, options: Options) => Promise<void>;
  delete: (id: string) => Promise<void>;
  fetch: (options?: Options) => Promise<void>;
  update: (body: UpdateProps, options: Options) => Promise<void>;
};

const SERVER_PATH = '/apis';

export default defineStore('apis', (): ApiStore => {
  const { isLoading, request, toast } = useBaseRequest();
  const list = ref<ApiWithResourceModel[]>([]);

  const cache = useCacheKey();

  /**
   * Resets data in state.
   */
  const clear = () => {
    cache.invalidate();
    list.value = [];
  };

  /**
   * A function that creates the API.
   *
   * @param body{CreateProps}
   * @param options{Options}
   */
  const create = async (
    payload: CreateProps,
    options: Options
  ): Promise<void> => {
    await request(SERVER_PATH, {
      method: 'POST',
      body: {
        ...payload,
        projectApiKey: useProjectApiKey(),
      },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created an API endpoint!');

          if (typeof options.onSuccess === 'function') {
            await options.onSuccess();
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
  const del = async (id: string): Promise<void> => {
    await request(`/apis/${id}`, {
      method: 'DELETE',
      query: { projectApiKey: useProjectApiKey() },
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
  const fetch = async (options: Options = {}): Promise<void> => {
    if (cache.mutate(options.mutateCache || false)) {
      return;
    }

    await request(SERVER_PATH, {
      method: 'GET',
      query: { projectApiKey: useProjectApiKey() },
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
  const update = async (
    payload: UpdateProps,
    options: Options
  ): Promise<void> => {
    await request(`/apis/${payload.id}`, {
      method: 'PUT',
      body: {
        ...payload,
        projectApiKey: useProjectApiKey(),
      },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Updated the api!');

          if (typeof options.onSuccess === 'function') {
            await options.onSuccess();
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
