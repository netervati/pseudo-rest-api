import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { ResourceModel } from '~~/types/models';

type Structure = {
  default: string;
  id: string;
  name: string;
  type: string;
}[];

type BodyParams = {
  name: string;
  projectApiKey: string;
  structure: Structure;
};

type UpdateParams = {
  id: string;
  name?: string;
  projectApiKey: string;
  structure: Structure;
};

type DeleteParams = {
  id: string;
  projectApiKey: string;
};

type Options = {
  onSuccess?: () => void;
};

type ResourceModelStore = {
  list: Ref<ResourceModel[]>;
  target: Ref<string>;
  clear: () => void;
  create: (body: BodyParams, options: Options) => Promise<void>;
  delete: (params: DeleteParams, options?: Options) => Promise<void>;
  fetch: (projectApiKey: string) => Promise<void>;
  update: (body: UpdateParams, options: Options) => Promise<void>;
};

export default defineStore('resouce-models', (): ResourceModelStore => {
  const list = ref<ResourceModel[]>([]);
  const target = ref<string>('');
  const toast = useToast();

  /**
   * Resets data in state.
   */
  const clear = () => {
    list.value = [];
  };

  /**
   * A function for creating resource model.
   */
  const create = async (body: BodyParams, options: Options): Promise<void> => {
    await $fetch('/resource-models', {
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
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  const del = async (
    params: DeleteParams,
    options: Options = {}
  ): Promise<void> => {
    await $fetch(`/resource-models/${params.id}`, {
      method: 'DELETE',
      query: { projectApiKey: params.projectApiKey },
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the resource model!');

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
   * A function for fetching resource models from the server.
   */
  const fetch = async (projectApiKey: string): Promise<void> => {
    await $fetch('/resource-models', {
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

    await $fetch(`/resource-models/${body.id}`, {
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
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  return {
    // PROPERTIES
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
