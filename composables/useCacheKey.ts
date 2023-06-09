import { ComputedRef } from 'vue';

type CacheKeyProps = {
  isValidated: ComputedRef<boolean>;
  mutate: (toRevalidate: boolean) => boolean;
  revalidate: () => void;
};

/**
 * An internal composable for caching fetch requests. This is only a
 * temporarily solution to avoid unnecessary re-fetch. Consider
 * using `useLazyFetch` or `useFetch` later.
 *
 * @returns {CacheKeyProps}
 */
export default function (): CacheKeyProps {
  const cacheKeys = reactive({
    current: 0,
    next: 1,
  });

  const isValidated = computed(() => cacheKeys.current === cacheKeys.next);

  const mutate = (toRevalidate?: boolean) => {
    if (toRevalidate) {
      cacheKeys.next += 1;
    }

    if (isValidated.value) {
      return true;
    }

    cacheKeys.current = cacheKeys.next;

    return false;
  };

  const revalidate = () => {
    cacheKeys.next += 1;
  };

  return {
    isValidated,
    mutate,
    revalidate,
  };
}
