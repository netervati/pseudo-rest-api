import { UnwrapNestedRefs } from 'nuxt/dist/app/compat/capi';

type ValidationRules = {
  [key: string]: {
    error: string;
    rule: (value: string) => boolean;
  };
};

const VALIDATION_RULES: ValidationRules = {
  blank: {
    error: '* cannot be blank.',
    rule: (value: string) => value.trim() === '',
  },
};

type Controls = {
  loading: boolean;
  showConfirm: boolean;
};

type Validations = {
  validations: {
    [key: string]: string;
  };
};

type ModalForm<T> = {
  controls: UnwrapNestedRefs<Controls>;
  fields: UnwrapNestedRefs<Omit<T, 'validations'>>;
  cancel: () => void;
  close: () => void;
  proceed: () => Promise<void>;
  save: () => void;
};

type Options<T> = {
  onClose: () => Promise<void>;
  onProceed: (body: Omit<T, 'validations'>) => Promise<void>;
};

/**
 *
 * A composable for managing modal form controls
 * and behaviours.
 *
 * @example
 *   <script setup>
 *     const form = useModalForm(
 *       {
 *         nameError: '',
 *         name: '',
 *         validation: {
 *           name: 'blank',
 *         },
 *       },
 *       {
 *         onProceed: async () => {
 *           // Some api request
 *         }
 *       }
 *     );
 *   </script>
 *
 *   <template>
 *     <input
 *       v-model="form.fields.name"
 *       :disabled="form.fields.nameError !== ''"
 *     />
 *   </template>
 *
 * @param deps
 * @param options
 * @returns
 */
export default function <T extends object & Validations>(
  deps: T,
  options: Options<T>
): ModalForm<T> {
  const controls = reactive<Controls>({
    loading: false,
    showConfirm: false,
  });

  const { validations, ...props } = deps;
  const fields = reactive(props);

  const handleCancel = () => {
    controls.showConfirm = false;
  };

  const handleClose = () => {
    unsetForm();
  };

  const handleProceed = async () => {
    controls.loading = true;

    if (typeof options.onProceed === 'function') {
      await options.onProceed(props);
    }

    controls.loading = false;

    unsetForm();
  };

  const handleSave = () => {
    if (!validateForm()) {
      controls.showConfirm = true;
    }
  };

  const unsetForm = () => {
    if (typeof options.onClose === 'function') {
      options.onClose();
    }

    for (const [key, value] of Object.entries(props)) {
      // @ts-ignore
      fields[key] = value;
    }
  };

  const validateForm = () => {
    let withErrors = false;

    for (const [key, value] of Object.entries(validations)) {
      const validate = VALIDATION_RULES[value];

      // @ts-ignore
      if (validate.rule(fields[key])) {
        // @ts-ignore
        fields[`${key}Error`] = validate.error.replace('*', titleize(key));
        withErrors = true;
      }
    }

    return withErrors;
  };

  return {
    controls,
    fields,
    cancel: handleCancel,
    close: handleClose,
    proceed: handleProceed,
    save: handleSave,
  };
}
