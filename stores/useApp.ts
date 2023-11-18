import { defineStore } from 'pinia';
import { AppWithAppKey } from '~/types/models';

type CreateProps = {
  description: string;
  title: string;
};

type Options = {
  onSuccess?: (key: string) => void;
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

  return {
    /** PROPERTIES */
    isDisabled,
    isLoading: pending,
    list,
    target,

    /** METHODS */
    create,
    refresh,
  };
});
