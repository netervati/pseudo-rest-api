<script lang="ts" setup>
  import { FormValidator, runValidations } from '~~/utils/formValidations';

  const emit = defineEmits<{
    (e: 'change', value: string): void;
  }>();

  const props = defineProps<{
    disabled: boolean;
    name: string;
    placeholder: string;
    rules?: { [key: string]: FormValidator | string };
    value?: string;
  }>();

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
    @change="emit('change', value)"
  />
  <p class="text-red-600">
    {{ errorMessage }}
  </p>
</template>
