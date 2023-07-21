import { defineStore } from 'pinia';
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
  onSuccess?: () => void | Promise<void>;
};

export default defineStore('apis', () => {
  const toast = useToast();

  const { data, pending, refresh } = useLazyFetch<ApiWithResourceModel[]>(
    '/apis',
    {
      method: 'GET',
      query: { projectApiKey: useProjectApiKey() },
      server: false,
    }
  );

  const list = computed(() => data.value || []);
  const isDisabled = computed(() => list.value.length === 5 || pending.value);

  const create = async (
    payload: CreateProps,
    options: Options
  ): Promise<void> => {
    await $fetch('/apis', {
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

          await refresh();
        }
      },
    });
  };

  const del = async (id: string): Promise<void> => {
    await $fetch(`/apis/${id}`, {
      method: 'DELETE',
      query: { projectApiKey: useProjectApiKey() },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the api!');

          await refresh();
        }
      },
    });
  };

  const update = async (
    payload: UpdateProps,
    options: Options
  ): Promise<void> => {
    await $fetch(`/apis/${payload.id}`, {
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

    /** METHODS */
    create,
    delete: del,
    refresh,
    update,
  };
});
