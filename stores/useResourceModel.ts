import { defineStore } from 'pinia';
import { ResourceModel } from '~~/types/models';

type Structure = {
  default: string;
  id: string;
  name: string;
  type: string;
}[];

type CreateProps = {
  name: string;
  structure: Structure;
};

type UpdateProps = {
  id: string;
  name?: string;
  structure: Structure;
};

type Options = {
  mutateCache?: boolean;
  onSuccess?: () => void | Promise<void>;
};

export default defineStore('resource-models', () => {
  const toast = useToast();

  const { data, pending, refresh } = useLazyFetch<ResourceModel[]>(
    '/resource-models',
    {
      method: 'GET',
      query: { projectApiKey: useProjectApiKey() },
      server: false,
    }
  );

  const list = computed(() => data.value || []);
  const isDisabled = computed(() => list.value.length === 5 || pending.value);
  const target = ref<string>('');

  const create = async (
    payload: CreateProps,
    options: Options
  ): Promise<void> => {
    await $fetch('/resource-models', {
      method: 'POST',
      body: {
        ...payload,
        projectApiKey: useProjectApiKey(),
      },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created a resource model!');

          if (typeof options.onSuccess === 'function') {
            await options.onSuccess();
          }

          await refresh();
        }
      },
    });
  };

  const del = async (id: string): Promise<void> => {
    await $fetch(`/resource-models/${id}`, {
      method: 'DELETE',
      query: { projectApiKey: useProjectApiKey() },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the resource model!');

          await refresh();
        }
      },
    });
  };

  const update = async (body: UpdateProps, options: Options): Promise<void> => {
    const payload: {
      name?: string;
      projectApiKey: string;
      structure: Structure;
    } = {
      projectApiKey: useProjectApiKey(),
      structure: body.structure,
    };

    if (body.name) {
      payload.name = body.name;
    }

    await $fetch(`/resource-models/${body.id}`, {
      method: 'PUT',
      body: payload,
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Updated the resource model!');

          if (typeof options.onSuccess === 'function') {
            await options.onSuccess();
          }

          await refresh();
        }
      },
    });
  };

  return {
    // PROPERTIES
    isDisabled,
    isLoading: pending,
    list,
    target,

    // OPERATIONS
    create,
    delete: del,
    refresh,
    update,
  };
});
