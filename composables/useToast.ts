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
  dark: (content: string) => void;
  error: (content: string) => void;
  info: (content: string) => void;
  show: (content: string, options: ToastProps) => void;
  success: (content: string) => void;
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

  /**
   * Displays a configurable toast.
   *
   * @param content
   * @param options
   */
  const show = (content: string, options: ToastProps): void => {
    deps.content = titleize(content);
    deps.props = options;
    display.value = true;
  };

  /**
   * A syntactic sugar for displaying toast
   * with the color `error`.
   * @param content
   */
  const error = (content: string): void => {
    show(content, { color: 'error' });
  };

  /**
   * A syntactic sugar for displaying toast
   * with the color `info`.
   * @param content
   */
  const info = (content: string): void => {
    show(content, { color: 'info' });
  };

  /**
   * A syntactic sugar for displaying toast
   * with the color `dark`.
   * @param content
   */
  const dark = (content: string): void => {
    show(content, { color: 'dark' });
  };

  /**
   * A syntactic sugar for displaying toast
   * with the color `success`.
   * @param content
   */
  const success = (content: string): void => {
    show(content, { color: 'success' });
  };

  return {
    dark,
    error,
    info,
    show,
    success,
  };
}
