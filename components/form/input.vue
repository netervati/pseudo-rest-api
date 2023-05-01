<script lang="ts" setup>
  import { FormValidator, runValidations } from '~~/utils/formValidations';

  const props = defineProps<{
    disabled: boolean;
    name: string;
    placeholder: string;
    rules?: { [key: string]: FormValidator };
  }>();

  const validate = !props.rules ? () => true : runValidations(props.rules);
  const { value, errorMessage } = useField(props.name, validate);
</script>

<template>
  <Input
    v-model="value"
    :disabled="props.disabled"
    :error="errorMessage !== undefined"
    :placeholder="props.placeholder"
  />
  <p class="text-red-600">
    {{ errorMessage }}
  </p>
</template>
