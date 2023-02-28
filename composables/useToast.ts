import { render } from 'vue';
import Toast from '~~/components/toast.vue';

function createElement() {
  const element = document.createElement('div');
  element.setAttribute('id', 'toast-container');
  document.body.append(element);

  return element;
}

type ToastProps = {
  color?: string;
  positionY?: string;
  positionX?: string;
};

type UseToast = {
  show: (content: string, options: ToastProps) => void;
};

/**
 * A simple composable for displaying and auto-clearing
 * of toast.
 *
 * @example
 *   const toast = useToast();
 *   toast.show('Hello World!', {
 *     color: 'success',
 *     positionY: 'top',
 *     positionX: 'right',
 *   });
 *
 * @returns
 */
export default function (): UseToast {
  const deps = reactive({
    content: '',
    props: {},
  });
  const display = ref(false);
  const element = computed(() => (display.value ? createElement() : null));

  watch(element, () => {
    if (element.value) {
      const vnode = h(Toast, deps.props, () => [deps.content]);
      render(vnode, element.value);

      setTimeout(() => {
        element.value?.remove();
        display.value = false;
      }, 3000);
    }
  });

  const show = (content: string, options: ToastProps) => {
    deps.content = titleize(content);
    deps.props = options;
    display.value = true;
  };

  return { show };
}
