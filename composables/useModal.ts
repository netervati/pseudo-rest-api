import { Component } from 'vue';

type ModalProps = {
  id: string;
  onConfirm?: (params?: string) => void | Promise<void>;
  onError?: () => void;
  onSuccess?: (params: string) => void;
};

type UseModal = {
  component: Component;
  open: () => void;
};

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

  const close = () => {
    display.value = false;
  };

  const open = () => {
    display.value = true;
  };

  const vnode = h(component, {
    ...options,
    onClose: close,
  });

  watch(display, () => {
    const checkbox = document.getElementById(options.id) as HTMLInputElement;

    if (checkbox !== null) {
      checkbox.checked = display.value;
    }
  });

  return {
    component: vnode,
    open,
  };
}
