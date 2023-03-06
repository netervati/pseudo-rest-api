import { UnwrapNestedRefs } from 'nuxt/dist/app/compat/capi';
import startCase from 'lodash/startCase';

type ValidationRules = {
  [key: string]: {
    error: string;
    rule: (value: string, deps?: { [key: string]: string }) => boolean;
  };
};

const VALIDATION_RULES: ValidationRules = {
  // COMMON RULES
  blank: {
    error: '* cannot be blank.',
    rule: (value) => value.trim() === '',
  },
  dropdown: {
    error: '* requires a selected option.',
    rule: (value) => value.trim() === '',
  },

  // CUSTOM RULES
  data_type_blank: {
    error: '* cannot be blank.',
    rule: (value, deps) =>
      deps!.name !== 'id' &&
      !deps!.type.includes('faker') &&
      !deps!.type.includes('uuid') &&
      value.trim() === '',
  },
  special_characters: {
    error: '* is invalid.',
    rule: (value) => {
      let withError = false;

      '`~!@#$%^&*()_+={}[];"\'\\|<,>.?'
        .split('')
        .concat(['//', '--', '/-', '-/'])
        .forEach((char) => {
          if (value.includes(char)) {
            withError = true;
          }
        });

      return withError;
    },
  },
};

type Controls = {
  loading: boolean;
  showConfirm: boolean;
};

type Validations = {
  validations: {
    [key: string]:
      | string
      | { [key: string]: string | { [key: string]: string } };
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
  onClose: () => void;
  onProceed: (body: UnwrapNestedRefs<Omit<T, 'validations'>>) => Promise<void>;
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
  const fields = reactive(structuredClone(props));

  const handleCancel = () => {
    controls.showConfirm = false;
  };

  const handleClose = () => {
    unsetForm();
  };

  const handleProceed = async () => {
    controls.loading = true;

    if (typeof options.onProceed === 'function') {
      await options.onProceed(fields);
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

    for (const [key, value] of Object.entries(structuredClone(props))) {
      // @ts-ignore
      fields[key] = value;
    }

    controls.loading = false;
    controls.showConfirm = false;
  };

  const validateForm = () => {
    let withErrors = false;

    for (const [key, value] of Object.entries(validations)) {
      if (typeof value === 'string') {
        for (const rule of value.split(',')) {
          const validate = VALIDATION_RULES[rule];

          // @ts-ignore
          if (validate.rule(fields[key])) {
            // @ts-ignore
            fields[`${key}Error`] = validate.error.replace('*', startCase(key));
            withErrors = true;
          }
        }

        continue;
      }

      if (value.constructor !== Object) {
        continue;
      }

      // @ts-ignore
      if (value.array?.constructor !== Object || !Array.isArray(fields[key])) {
        continue;
      }

      // @ts-ignore
      for (const el of fields[key]) {
        for (const [keyB, valueB] of Object.entries(value.array)) {
          const validate = VALIDATION_RULES[valueB];

          // @ts-ignore
          if (validate.rule(el[keyB], el)) {
            // @ts-ignore
            el[`${keyB}Error`] = validate.error.replace('*', startCase(keyB));
            withErrors = true;
          }
        }
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
