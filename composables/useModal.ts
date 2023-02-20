import { Component } from 'vue';

type ModalProps = {
  id: string;
  onError?: () => void;
  onSuccess?: (arg: string) => void;
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

  const vnode = h(component, {
    ...options,
    onClose: close,
  });

  const open = () => {
    display.value = true;
  };

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
