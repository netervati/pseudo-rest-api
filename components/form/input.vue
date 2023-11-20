<script lang="ts" setup>
  import { FormRuleSchema, runValidations } from '~~/utils/formValidations';

  const emit = defineEmits<{
    (e: 'change', value: string): void;
  }>();

  interface Props {
    disabled: boolean;
    name: string;
    placeholder: string;
    rules?: FormRuleSchema;
    type?: 'text' | 'number';
    value?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
  });

  const validate = !props.rules ? () => true : runValidations(props.rules);
  const { value, errorMessage } = useField(() => props.name, validate);

  watchEffect(() => {
    if (props.value) {
      value.value = props.value;
    }
  });
</script>

<template>
  <Input
    v-model="value"
    :disabled="props.disabled"
    :error="errorMessage !== undefined"
    :placeholder="props.placeholder"
    :type="props.type"
    @change="emit('change', value)"
  />
  <p class="text-red-600">
    {{ errorMessage }}
  </p>
</template>
