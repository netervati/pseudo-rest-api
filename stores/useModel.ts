import { defineStore } from 'pinia';
import cloneDeep from 'lodash/cloneDeep';
import { NormalizedModel } from '~/types/models';

type Schema = { name: string; type: string }[];

type CreateProps = {
  name: string;
  schema: Schema;
};

type UpdateProps = {
  name: string;
  schema: Schema;
};

type Options = {
  onSuccess?: (params?: NormalizedModel) => void | Promise<void>;
};

export default defineStore('models', () => {
  const toast = useToast();
  const apiKey = useAppRefKey();
  const target = ref<NormalizedModel>();

  const { data, pending, refresh } = useLazyFetch<NormalizedModel[]>(
    '/models',
    {
      method: 'GET',
      query: { apiKey },
      server: false,
    }
  );

  const list = computed(() => data.value || []);
  const isDisabled = computed(() => list.value.length === 10 || pending.value);

  const setTarget = (md: NormalizedModel) => {
    target.value = cloneDeep(md);
  };

  const unsetTarget = () => {
    target.value = undefined;
  };

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
            options.onSuccess();
          }

          await refresh();
        }

        if (response.status === 400) {
          toast.error(response._data.statusMessage);
        }
      },
    });
  };

  const del = async (id: string): Promise<void> => {
    await $fetch(`/models/${id}`, {
      method: 'DELETE',
      query: { apiKey },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the model!');

          await refresh();
        }
      },
    });
  };

  const update = async (body: UpdateProps, options: Options): Promise<void> => {
    const payload: {
      apiKey: string;
      name?: string;
      schema: Schema;
    } = {
      apiKey,
      schema: body.schema,
    };

    if (body.name) {
      payload.name = body.name;
    }

    await $fetch(`/models/${target.value?.id}`, {
      method: 'PUT',
      body: payload,
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Updated the model!');

          if (typeof options.onSuccess === 'function') {
            await options.onSuccess(response._data);
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
    delete: del,
    refresh,
    setTarget,
    unsetTarget,
    update,
  };
});
