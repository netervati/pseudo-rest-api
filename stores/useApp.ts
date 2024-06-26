import { defineStore } from 'pinia';
import cloneDeep from 'lodash/cloneDeep';
import { AppWithAppKey } from '~/types/models';

type CreateProps = {
  description: string;
  title: string;
};

type UpdateProps = {
  id: string;
  description?: string;
  title: string;
};

type Options = {
  onSuccess?: (key?: string) => void;
};

export default defineStore('apps', () => {
  const toast = useToast();

  const { data, pending, refresh } = useLazyFetch<AppWithAppKey[]>('/apps', {
    method: 'GET',
    server: false,
  });

  const list = computed(() => data.value || []);
  const isDisabled = computed(() => list.value.length === 2 || pending.value);
  const target = ref<AppWithAppKey | undefined>();

  const setTarget = (app: AppWithAppKey) => {
    target.value = cloneDeep(app);
  };

  const create = async (body: CreateProps, options: Options): Promise<void> => {
    await $fetch('/apps', {
      method: 'POST',
      body,
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created an app!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess(response._data.secretKey);
          }

          await refresh();
        }
      },
    });
  };

  const del = async (id: string, options: Options): Promise<void> => {
    await $fetch(`/apps/${id}`, {
      method: 'DELETE',
      async onResponse({ response }) {
        if (response.status === 204) {
          toast.success('Deleted the app!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess();
          }

          await refresh();
        }
      },
    });
  };

  const update = async (
    payload: UpdateProps,
    options: Options
  ): Promise<void> => {
    await $fetch(`/apps/${payload.id}`, {
      method: 'PUT',
      body: {
        description: payload.description,
        title: payload.title,
        apiKey: useAppRefKey().value,
      },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Updated app!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess(response._data.secretKey);
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
    target,

    /** METHODS */
    create,
    delete: del,
    refresh,
    setTarget,
    update,
  };
});
