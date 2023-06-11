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
    try {
      isLoading.value = true;

      await $fetch(path, config);
    } catch (err: any) {
      console.log(err.statusMessage);
      toast.error(err.statusMessage);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    request,
    toast,
  };
}
