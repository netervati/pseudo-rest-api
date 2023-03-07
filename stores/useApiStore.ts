import { defineStore } from 'pinia';

type BodyParams = {
  description: string;
  projectApiKey: string;
  urlPath: string;
};

type Options = {
  onSuccess?: () => void;
};

type ApiStore = {
  create: (body: BodyParams, options: Options) => Promise<void>;
};

export default defineStore('apis', (): ApiStore => {
  const toast = useToast();

  /**
   * A function for creating api.
   */
  const create = async (body: BodyParams, options: Options): Promise<void> => {
    await $fetch('/apis', {
      method: 'POST',
      body,
      onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created an API endpoint!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess();
          }
        }
      },
    }).catch((error) => {
      toast.error(error.statusMessage);
    });
  };

  return {
    create,
  };
});
