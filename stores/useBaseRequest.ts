import { NitroFetchOptions } from 'nitropack';

export default function () {
  const isLoading = ref(false);
  const toast = useToast();

  /**
   * NOTE: This generic type doesn't validate if HTTP Method is
   * allowed for url path correctly. Consider revisting this again.
   */
  const request = async <T extends string = `/_${string}`>(
    path: string,
    config: NitroFetchOptions<T>
  ) => {
    isLoading.value = true;

    await $fetch(path, config).catch((error) => {
      console.log(error, error.message);
      toast.error(error.message);
    });

    isLoading.value = false;
  };

  return {
    isLoading,
    request,
    toast,
  };
}
