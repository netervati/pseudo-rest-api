import { Component, render } from 'vue';

type ModalProps = {
  onError?: () => void;
  onSuccess?: (arg: string) => void;
};

type UseModal = {
  open: () => void;
};

/**
 * A composable for managing modals.
 *
 * @example
 *   import Modal from '~~/components/modal.vue';
 *
 *   const modal = useModal(modal);
 *   modal.open();
 *
 * @param component
 * @param options
 * @return
 **/
export default function (
  component: Component,
  options: ModalProps = {}
): UseModal {
  const display = ref(false);
  const modalId = `modal-${Date.now()}`;

  const close = () => {
    display.value = false;
  };

  onMounted(() => {
    const body = document.body;
    const vnode = h(component, {
      ...options,
      id: modalId,
      onClose: close,
    });

    render(vnode, body);
  });

  const open = () => {
    display.value = true;
  };

  watch(display, () => {
    const checkbox = document.getElementById(modalId) as HTMLInputElement;

    if (checkbox) {
      checkbox.checked = display.value;
    }
  });

  return { open };
}
