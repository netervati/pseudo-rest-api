<script lang="ts" setup>
  import { FormValidator, runValidations } from '~~/utils/formValidations';

  const emit = defineEmits<{
    (e: 'change', value: string): void;
  }>();

  const props = defineProps<{
    disabled: boolean;
    max: number;
    min: number;
    name: string;
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
  <input
    v-model="value"
    :disabled="props.disabled"
    :max="props.max"
    :min="props.min"
    class="range range-xs"
    type="range"
    @change="emit('change', value)"
  />
  <p class="text-red-600">
    {{ errorMessage }}
  </p>
  <section class="grid grid-cols-2">
    <div>{{ value }}</div>
    <div class="text-end">{{ props.max }}</div>
  </section>
</template>
