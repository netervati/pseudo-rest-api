import { Component, UnwrapNestedRefs } from 'vue';

type ModalProps = {
  id: string;
  deps?:
    | { [key: string]: string | number | boolean }
    | UnwrapNestedRefs<{ [key: string]: string | number | boolean }>;
  onClose?: () => void;
  onConfirm?: (callback: () => void) => void | Promise<void>;
  onError?: () => void;
  onSuccess?: (params: string) => void;
};

type UseModal = {
  component: Component;
  open: () => void;
};

const sleep = (ms: number) =>
  new Promise((resolve, _reject) => setTimeout(() => resolve(ms), ms));

/**
 * A composable for managing modals.
 *
 * @example
 *   <script setup>
 *     import Modal from '~~/components/modal.vue';
 *
 *     const modal = useModal(modal);
 *     modal.open();
 *   </script>
 *
 *   <template>
 *     <ClientOnly>
 *       <modal.component />
 *     </ClientOnly>
 *   </template>
 *
 * @param component
 * @param options
 * @return
 **/
export default function (
  component: Component,
  options: ModalProps = { id: 'base' }
): UseModal {
  const display = ref(false);
  const refreshKey = ref(new Date());

  const close = () => {
    display.value = false;

    if (typeof options.onClose === 'function') {
      options.onClose();
    }
  };

  const open = async () => {
    refreshKey.value = new Date();

    await nextTick();
    await sleep(50);

    display.value = true;
  };

  watch(display, () => {
    const checkbox = document.getElementById(options.id) as HTMLInputElement;

    if (checkbox !== null) {
      checkbox.checked = display.value;
    }
  });

  return {
    component: {
      render() {
        return h(component, {
          ...options,
          key: refreshKey.value,
          onClose: close,
        });
      },
    },
    open,
  };
}
