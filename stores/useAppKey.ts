import { defineStore } from 'pinia';

type Options = {
  onSuccess?: (data: { apiKey: string; secretKey: string }) => void;
};

type AppKeyStore = {
  regenerate: (id: string, options: Options) => Promise<void>;
};

export default defineStore('appKeys', (): AppKeyStore => {
  const toast = useToast();

  /**
   * A function for generating new secret key.
   */
  const regenerate = async (id: string, options: Options): Promise<void> => {
    await $fetch(`/apps/${id}/generate-secret-key`, {
      method: 'POST',
      body: {
        appKey: useAppRefKey().value,
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
