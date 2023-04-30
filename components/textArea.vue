<script setup lang="ts">
  const emit = defineEmits<{
    (e: 'change'): void;
    (e: 'update:modelValue', value: string): void;
  }>();

  interface Props {
    class?: string;
    disabled?: boolean;
    error?: boolean;
    modelValue: string;
    placeholder?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    class: '',
    disabled: false,
    error: false,
    placeholder: '',
  });

  const textAreaValue = computed({
    get() {
      return props.modelValue;
    },
    set(value: string) {
      emit('change');
      emit('update:modelValue', value);
    },
  });
</script>

<template>
  <textarea
    v-model="textAreaValue"
    class="textarea textarea-bordered"
    :disabled="disabled"
    :placeholder="props.placeholder"
  />
</template>
