import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { ProjectWithProjectKey } from '~~/types/models';

type BodyParams = {
  description: string;
  name: string;
};

type Options = {
  onSuccess?: (key: string) => void;
};

type ProjectStore = {
  list: Ref<ProjectWithProjectKey[]>;
  create: (body: BodyParams, options: Options) => Promise<void>;
  fetch: () => Promise<void>;
};

export default defineStore('projects', (): ProjectStore => {
  const list = ref<ProjectWithProjectKey[]>([]);
  const toast = useToast();

  /**
   * A function for creating project.
   */
  const create = async (body: BodyParams, options: Options): Promise<void> => {
    await $fetch('/projects', {
      method: 'POST',
      body,
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created a project!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess(response._data.secretKey);
          }
        }
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  /**
   * A function for fetching projects from the server.
   */
  const fetch = async (): Promise<void> => {
    await $fetch('/projects', {
      method: 'GET',
      onResponse({ response }) {
        if (response.status === 200) {
          list.value = response._data;
        }
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  return {
    list,
    create,
    fetch,
  };
});
