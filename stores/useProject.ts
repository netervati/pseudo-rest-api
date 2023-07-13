import { defineStore } from 'pinia';
import { ProjectWithProjectKey } from '~/types/models';

type CreateProps = {
  description: string;
  name: string;
};

type UpdateProps = {
  id: string;
  description?: string;
  name: string;
};

type Options = {
  onSuccess?: (key: string) => void;
};

export default defineStore('projects', () => {
  const toast = useToast();

  const { data, pending, refresh } = useLazyFetch<ProjectWithProjectKey[]>(
    '/projects',
    {
      method: 'GET',
      server: false,
    }
  );

  const list = computed(() => data.value || []);
  const isDisabled = computed(() => list.value.length === 2 || pending.value);
  const target = ref<ProjectWithProjectKey | undefined>();

  const create = async (body: CreateProps, options: Options): Promise<void> => {
    await $fetch('/projects', {
      method: 'POST',
      body,
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created a project!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess(response._data.secretKey);
          }

          await refresh();
        }
      },
    });
  };

  const del = async (id: string, options: Options): Promise<void> => {
    await $fetch(`/projects/${id}`, {
      method: 'DELETE',
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the project!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess(response._data);
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
    await $fetch(`/projects/${payload.id}`, {
      method: 'PUT',
      body: {
        description: payload.description,
        name: payload.name,
        projectApiKey: useProjectApiKey(),
      },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Updated project!');

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
    update,
  };
});
