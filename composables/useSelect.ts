import { ComputedRef, Ref } from 'vue';

type SelectProps = {
  isEmpty: ComputedRef<boolean>;
  list: Ref<Set<string>>;
  clear: () => void;
  ticked: (target: string | { id: string }[]) => boolean;
  tick: (target: string | { id: string }[]) => void;
};

/**
 * A simple composable for storing list of resource data ID.
 */
export function useSelect(): SelectProps {
  const list = ref(new Set<string>());
  const isEmpty = computed(() => list.value.size === 0);

  const clear = () => {
    list.value.clear();
  };

  const ticked = (target: string | { id: string }[]) => {
    if (Array.isArray(target)) {
      if (target.length === 0) {
        return false;
      }

      return list.value.size === target.length;
    }

    return list.value.has(target);
  };

  const tick = (target: string | { id: string }[]) => {
    if (Array.isArray(target)) {
      if (list.value.size !== target.length) {
        clear();

        target.forEach(({ id }) => list.value.add(id));
      } else {
        clear();
      }

      return;
    }

    if (ticked(target)) {
      list.value.delete(target);
    } else {
      list.value.add(target);
    }
  };

  return {
    /** PROPERTIES */
    isEmpty,
    list,

    /** METHODS */
    clear,
    ticked,
    tick,
  };
}
