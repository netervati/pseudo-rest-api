import { Ref } from 'vue';
import { defineStore } from 'pinia';
import useBaseRequest from './useBaseRequest';
import { ResourceData } from '~~/types/models';

type FetchProps = {
  projectApiKey: string;
  resourceModelId: string;
};

type BulkDeleteProps = { ids: string } & FetchProps;
type CreateProps = { count: number } & FetchProps;
type DeleteProps = { id: string } & FetchProps;

type Options = {
  onSuccess?: () => void;
};

type ResourceDataHash = { [key: string]: ResourceData[] };

type ResourceDataStore = {
  isLoading: Ref<boolean>;
  list: Ref<ResourceDataHash>;
  bulkDelete: (params: BulkDeleteProps) => Promise<void>;
  clear: (resourceModelId: string) => void;
  create: (body: CreateProps, options: Options) => Promise<void>;
  delete: (params: DeleteProps) => Promise<void>;
  fetch: (projectApiKey: string, resourceModelId: string) => Promise<void>;
};

export default defineStore('resource-data', (): ResourceDataStore => {
  const { isLoading, request, toast } = useBaseRequest();
  const list = ref<ResourceDataHash>({});

  /**
   * Resets data in state.
   */
  const clear = (resourceModelId: string) => {
    list.value[resourceModelId] = [];
  };

  /**
   * A function that bulk deletes Resource Data.
   *
   * @param params{BulkDeleteProps}
   */
  const bulkDelete = async (params: BulkDeleteProps): Promise<void> => {
    await request(`/resource-models/${params.resourceModelId}/resource-data`, {
      method: 'DELETE',
      query: {
        ids: params.ids,
        projectApiKey: params.projectApiKey,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the resource data!');
        }
      },
    });
  };

  /**
   * A function that creates the Resource Data.
   *
   * @param body{CreateProps}
   * @param options{Options}
   */
  const create = async (body: CreateProps, options: Options): Promise<void> => {
    await request(`/resource-models/${body.resourceModelId}/resource-data`, {
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
    });
  };

  /**
   * A function that deletes a Resource Data.
   *
   * @param params{DeleteProps}
   */
  const del = async (params: DeleteProps): Promise<void> => {
    await request(
      `/resource-models/${params.resourceModelId}/resource-data/${params.id}`,
      {
        method: 'DELETE',
        query: { projectApiKey: params.projectApiKey },
        onResponse({ response }) {
          if (response.status === 200) {
            toast.success('Deleted the resource model!');
          }
        },
      }
    );
  };

  /**
   * A function for fetching the Resource Data from the server.
   *
   * @param projectApiKey{string}
   * @param resourceModelId{string}
   */
  const fetch = async (
    projectApiKey: string,
    resourceModelId: string
  ): Promise<void> => {
    await request(`/resource-models/${resourceModelId}/resource-data`, {
      method: 'GET',
      query: { projectApiKey },
      onResponse({ response }) {
        if (response.status === 200) {
          const responseList = response._data;

          if (responseList.length > 0) {
            list.value[responseList[0].resource_model_id] = response._data;
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
    bulkDelete,
    clear,
    create,
    delete: del,
    fetch,
  };
});
