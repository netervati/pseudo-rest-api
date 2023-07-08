import { defineStore } from 'pinia';

type Options = {
  onSuccess?: (data: { projectApiKey: string; secretKey: string }) => void;
};

type ProjectKeyStore = {
  regenerate: (id: string, options: Options) => Promise<void>;
};

export default defineStore('projectKeys', (): ProjectKeyStore => {
  const toast = useToast();

  /**
   * A function for generating new secret key.
   */
  const regenerate = async (id: string, options: Options): Promise<void> => {
    await $fetch(`/projects/${id}/generate-secret-key`, {
      method: 'POST',
      body: {
        projectApiKey: useProjectApiKey(),
      },
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Generated new keys!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess(response._data);
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
