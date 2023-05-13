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

  const mergedClass = computed(() => {
    return {
      [props.class]: props.class !== '',
      'input-error': props.error,
    };
  });

  const inputValue = computed({
    get() {
      return props.modelValue;
    },
    set(value: string) {
      emit('update:modelValue', value);
      emit('change');
    },
  });
</script>

<template>
  <input
    v-model="inputValue"
    class="input input-bordered w-full max-w-vs"
    type="text"
    :class="mergedClass"
    :disabled="disabled"
    :placeholder="placeholder"
  />
</template>
