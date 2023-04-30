<script lang="ts" setup>
  const props = defineProps<{
    disabled: boolean;
    name: string;
    placeholder: string;
    rule?: (value: string) => boolean | string;
  }>();

  const validate = props.rule || (() => true);
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
