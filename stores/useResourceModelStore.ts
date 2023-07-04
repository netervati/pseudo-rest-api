import { Ref } from 'vue';
import { defineStore } from 'pinia';
import useBaseRequest from './useBaseRequest';
import { ResourceModel } from '~~/types/models';

type Structure = {
  default: string;
  id: string;
  name: string;
  type: string;
}[];

type CreateProps = {
  name: string;
  projectApiKey: string;
  structure: Structure;
};

type UpdateProps = {
  id: string;
  name?: string;
  projectApiKey: string;
  structure: Structure;
};

type Options = {
  mutateCache?: boolean;
  onSuccess?: () => void;
};

type ResourceModelStore = {
  isLoading: Ref<boolean>;
  list: Ref<ResourceModel[]>;
  target: Ref<string>;
  clear: () => void;
  create: (body: CreateProps, options: Options) => Promise<void>;
  delete: (id: string, projectApiKey: string) => Promise<void>;
  fetch: (projectApiKey: string, options?: Options) => Promise<void>;
  update: (body: UpdateProps, options: Options) => Promise<void>;
};

const SERVER_PATH = '/resource-models';

export default defineStore('resource-models', (): ResourceModelStore => {
  const { isLoading, request, toast } = useBaseRequest();
  const list = ref<ResourceModel[]>([]);
  const target = ref<string>('');

  const cache = useCacheKey();

  /**
   * Resets data in state.
   */
  const clear = () => {
    cache.invalidate();
    list.value = [];
  };

  /**
   * A function that creates the Resource Model.
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
          toast.success('Created a resource model!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess();
          }
        }
      },
    });
  };

  /**
   * A function that deletes a Resource Model.
   *
   * @param id{string}
   * @param projectApiKey{string}
   */
  const del = async (id: string, projectApiKey: string): Promise<void> => {
    await request(`/resource-models/${id}`, {
      method: 'DELETE',
      query: { projectApiKey },
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the resource model!');
        }
      },
    });
  };

  /**
   * A function for fetching the APIs from the server.
   *
   * @param projectApiKey{string}
   */
  const fetch = async (
    projectApiKey: string,
    options: Options = {}
  ): Promise<void> => {
    if (cache.mutate(options.mutateCache || false)) {
      return;
    }

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
   * A function for updating a Resource Model.
   *
   * @param body{UpdateProps}
   * @param options{Options}
   */
  const update = async (body: UpdateProps, options: Options): Promise<void> => {
    const payload: {
      name?: string;
      projectApiKey: string;
      structure: Structure;
    } = {
      projectApiKey: body.projectApiKey,
      structure: body.structure,
    };

    if (body.name) {
      payload.name = body.name;
    }

    await request(`/resource-models/${body.id}`, {
      method: 'PUT',
      body: payload,
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Updated the resource model!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess();
          }
        }
      },
    });
  };

  return {
    // PROPERTIES
    isLoading,
    list,
    target,

    // OPERATIONS
    clear,
    create,
    delete: del,
    fetch,
    update,
  };
});
