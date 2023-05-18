import { defineStore } from 'pinia';

type GenerateSKParams = {
  id: string;
  projectApiKey: string;
};

type Options = {
  onSuccess?: (key: string) => void;
};

type ProjectKeyStore = {
  regenerate: (body: GenerateSKParams, options: Options) => Promise<void>;
};

export default defineStore('projectKeys', (): ProjectKeyStore => {
  const toast = useToast();

  /**
   * A function for generating new secret key.
   */
  const regenerate = async (
    body: GenerateSKParams,
    options: Options
  ): Promise<void> => {
    await $fetch(`/projects/${body.id}/generate-secret-key`, {
      method: 'POST',
      body: {
        projectApiKey: body.projectApiKey,
      },
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

  return {
    regenerate,
  };
});
