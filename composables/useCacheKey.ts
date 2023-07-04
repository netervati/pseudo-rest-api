type CacheKeyProps = {
  invalidate: () => void;
  mutate: (toInvalidate: boolean) => boolean;
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

  const invalidate = () => {
    cacheKeys.next += 1;
  };

  const mutate = (toInvalidate?: boolean) => {
    if (toInvalidate) {
      invalidate();
    }

    if (cacheKeys.current === cacheKeys.next) {
      return true;
    }

    cacheKeys.current = cacheKeys.next;

    return false;
  };

  return {
    invalidate,
    mutate,
  };
}
