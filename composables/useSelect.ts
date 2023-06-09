import { Ref } from 'vue';

type SelectProps = {
  list: Ref<Set<string>>;
  clear: () => void;
  tick: (id: string) => void;
};

/**
 * A simple composable for storing list of resource data ID.
 */
export function useSelect(): SelectProps {
  const list = ref(new Set<string>());

  const clear = () => {
    list.value.clear();
  };

  const tick = (id: string) => {
    if (list.value.has(id)) {
      list.value.delete(id);
    } else {
      list.value.add(id);
    }
  };

  return {
    /** PROPERTIES */
    list,

    /** METHODS */
    clear,
    tick,
  };
}
