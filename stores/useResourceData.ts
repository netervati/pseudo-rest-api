import { defineStore } from 'pinia';
import { ResourceData } from '~~/types/models';

type Options = {
  onSuccess?: () => void;
};

export default defineStore('resource-data', () => {
  const toast = useToast();
  const resourceModelId = ref<string | null>(null);
  const path = computed(
    () => `/resource-models/${resourceModelId.value}/resource-data`
  );

  const { data, pending, refresh } = useLazyFetch<ResourceData[]>(path, {
    immediate: false,
    method: 'GET',
    query: { projectApiKey: useProjectApiKey() },
    server: false,
  });

  const list = computed(() => data.value || []);
  const isDisabled = computed(() => list.value.length === 5 || pending.value);

  const setResourceModelId = async (id: string) => {
    resourceModelId.value = id;
    await refresh();
  };

  const bulkDelete = async (ids: string): Promise<void> => {
    await $fetch(`/resource-models/${resourceModelId.value}/resource-data`, {
      method: 'DELETE',
      query: {
        ids,
        projectApiKey: useProjectApiKey(),
      },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the resource data!');

          await refresh();
        }
      },
    });
  };

  const create = async (count: number, options: Options): Promise<void> => {
    await $fetch(`/resource-models/${resourceModelId.value}/resource-data`, {
      method: 'POST',
      body: {
        count,
        projectApiKey: useProjectApiKey(),
      },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created resource data!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess();
          }

          await refresh();
        }
      },
    });
  };

  return {
    /** PROPERTIES */
    isDisabled,
    isLoading: pending,
    list,
    resourceModelId,

    /** METHODS */
    bulkDelete,
    create,
    refresh,
    setResourceModelId,
  };
});
