import { Ref } from 'vue';
import { defineStore } from 'pinia';
import useBaseRequest from './useBaseRequest';
import { ProjectWithProjectKey } from '~~/types/models';

type CreateProps = {
  description: string;
  name: string;
};

type UpdateProps = {
  id: string;
  name: string;
  projectApiKey: string;
};

type Options = {
  onSuccess?: (key: string) => void;
};

type ProjectStore = {
  isLoading: Ref<boolean>;
  list: Ref<ProjectWithProjectKey[]>;
  target: Ref<ProjectWithProjectKey | undefined>;
  create: (body: CreateProps, options: Options) => Promise<void>;
  delete: (id: string, options: Options) => Promise<void>;
  fetch: () => Promise<void>;
  update: (body: UpdateProps, options: Options) => Promise<void>;
};

const SERVER_PATH = '/projects';

export default defineStore('projects', (): ProjectStore => {
  const { isLoading, request, toast } = useBaseRequest();
  const list = ref<ProjectWithProjectKey[]>([]);
  const target = ref<ProjectWithProjectKey | undefined>();

  /**
   * A function that creates the Project.
   *
   * @param body{CreateProps}
   * @param options{Options}
   */
  const create = async (body: CreateProps, options: Options): Promise<void> => {
    await request(SERVER_PATH, {
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
    });
  };

  /**
   * A function that deletes a Project.
   *
   * @param id{string}
   */
  const del = async (id: string, options: Options): Promise<void> => {
    await request(`/projects/${id}`, {
      method: 'DELETE',
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Deleted the project!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess(response._data);
          }
        }
      },
    });
  };

  /**
   * A function for fetching the Projects from the server.
   */
  const fetch = async (): Promise<void> => {
    await request(SERVER_PATH, {
      method: 'GET',
      onResponse({ response }) {
        if (response.status === 200) {
          list.value = response._data;
        }
      },
    });
  };

  /**
   * A function for updating an Project.
   *
   * @param body{UpdateProps}
   * @param options{Options}
   */
  const update = async (body: UpdateProps, options: Options): Promise<void> => {
    await request(`/projects/${body.id}`, {
      method: 'PUT',
      body: {
        name: body.name,
        projectApiKey: body.projectApiKey,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Updated project!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess(response._data.secretKey);
          }
        }
      },
    });
  };

  return {
    /** PROPERTIES */
    isLoading,
    list,
    target,

    /** METHODS */
    create,
    delete: del,
    fetch,
    update,
  };
});
