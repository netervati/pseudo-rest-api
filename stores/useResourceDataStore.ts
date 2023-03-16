import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { ResourceData } from '~~/types/models';

type FetchParams = {
  projectApiKey: string;
  resourceModelId: string;
};

type BodyParams = { count: number } & FetchParams;
type DeleteParams = { id: string } & FetchParams;

type Options = {
  onSuccess?: () => void;
};

type ResourceDataHash = { [key: string]: ResourceData[] };

type ResourceDataStore = {
  list: Ref<ResourceDataHash>;
  clear: (resourceModelId: string) => void;
  create: (body: BodyParams, options: Options) => Promise<void>;
  delete: (params: DeleteParams, options?: Options) => Promise<void>;
  fetch: (body: FetchParams) => Promise<void>;
};

export default defineStore('resource-data', (): ResourceDataStore => {
  const list = ref<ResourceDataHash>({});
  const toast = useToast();

  /**
   * Resets data in state.
   */
  const clear = (resourceModelId: string) => {
    list.value[resourceModelId] = [];
  };

  /**
   * A function for creating resource data.
   */
  const create = async (body: BodyParams, options: Options): Promise<void> => {
    await $fetch(`/resource-models/${body.resourceModelId}/resource-data`, {
      method: 'POST',
      body: {
        count: body.count,
        projectApiKey: body.projectApiKey,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created resource data!');

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
   * A function for deleting resource data
   */
  const del = async (
    params: DeleteParams,
    options: Options = {}
  ): Promise<void> => {
    await $fetch(
      `/resource-models/${params.resourceModelId}/resource-data/${params.id}`,
      {
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
      }
    ).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  /**
   * A function for fetching resource data from the server.
   */
  const fetch = async (body: FetchParams): Promise<void> => {
    await $fetch(`/resource-models/${body.resourceModelId}/resource-data`, {
      method: 'GET',
      query: { projectApiKey: body.projectApiKey },
      onResponse({ response }) {
        if (response.status === 200) {
          const responseList = response._data;

          if (responseList.length > 0) {
            list.value[responseList[0].resource_model_id] = response._data;
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
  };
});
