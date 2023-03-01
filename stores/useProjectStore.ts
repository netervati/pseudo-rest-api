import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { ProjectWithProjectKey } from '~~/types/models';

const toast = useToast();

function popError(message: string): void {
  toast.show(message, {
    color: 'error',
  });
}

type ProjectStore = {
  list: Ref<ProjectWithProjectKey[]>;
  fetch: () => Promise<void>;
};

export default defineStore('projects', (): ProjectStore => {
  const list = ref<ProjectWithProjectKey[]>([]);

  /**
   * A function for fetching projects from the server.
   */
  const fetch = async (): Promise<void> => {
    await $fetch('/projects', {
      method: 'GET',
      onResponse({ response }) {
        list.value = response._data;
      },
    }).catch((error) => {
      popError(error.statusMessage);
    });
  };

  return {
    list,
    fetch,
  };
});
