<script lang="ts" setup>
  import { FormValidator, runValidations } from '~~/utils/formValidations';

  const props = defineProps<{
    disabled: boolean;
    name: string;
    placeholder: string;
    options: { text: string; value: string }[];
    rules?: { [key: string]: FormValidator };
    value?: string;
  }>();

  const validate = !props.rules ? () => true : runValidations(props.rules);
  const { value, errorMessage } = useField(props.name, validate);

  watchEffect(() => {
    if (props.value) {
      value.value = props.value;
    }
  });
</script>

<template>
  <Select
    v-model="value"
    :disabled="disabled"
    :error="errorMessage !== undefined"
  >
    <option disabled value="">{{ props.placeholder }}</option>
    <option
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.text }}
    </option>
  </Select>
  <p class="text-red-600">
    {{ errorMessage }}
  </p>
</template>
