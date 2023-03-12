import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { ResourceData } from '~~/types/models';

type BodyParams = {
  count: number;
  resourceModelId: string;
};

type Options = {
  onSuccess?: () => void;
};

type ResourceDataStore = {
  list: Ref<ResourceData[]>;
  clear: () => void;
  create: (body: BodyParams, options: Options) => Promise<void>;
};

export default defineStore('resouce-models', (): ResourceDataStore => {
  const list = ref<ResourceData[]>([]);
  const toast = useToast();

  /**
   * Resets data in state.
   */
  const clear = () => {
    list.value = [];
  };

  /**
   * A function for creating resource data.
   */
  const create = async (body: BodyParams, options: Options): Promise<void> => {
    await $fetch(`/resource-models/${body.resourceModelId}/resource-data`, {
      method: 'POST',
      body: { count: body.count },
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

  // @ts-ignore
  return {
    // @ts-ignore
    list,
    clear,
    create,
  };
});
