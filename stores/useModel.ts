import { defineStore } from 'pinia';
import { Model } from '~/types/models';
import cloneDeep from 'lodash/cloneDeep';

type CreateProps = {
  name: string;
  schema: { name: string; type: string }[];
};

type Options = {
  onSuccess?: (key: string) => void;
};

export default defineStore('models', () => {
  const toast = useToast();
  const apiKey = useAppRefKey();
  const target = ref<Model>();

  const { data, pending, refresh } = useLazyFetch<Model[]>('/models', {
    method: 'GET',
    query: { apiKey },
    server: false,
  });

  const list = computed(() => data.value || []);
  const isDisabled = computed(() => list.value.length === 10 || pending.value);

  const setTarget = (md: Model) => {
    target.value = cloneDeep(md);
  };

  const unsetTarget = () => {
    target.value = undefined;
  }

  const create = async (body: CreateProps, options: Options): Promise<void> => {
    await $fetch('/models', {
      method: 'POST',
      body: {
        apiKey,
        name: body.name,
        schema: body.schema,
      },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created a model!');

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
    data,
    list,
    target,

    /** METHODS */
    create,
    setTarget,
    unsetTarget
  };
});
