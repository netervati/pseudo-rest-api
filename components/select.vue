<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'change'): void;
    (e: 'update:modelValue', value: string): void;
  }>();

  interface Props {
    class?: string;
    disabled?: boolean;
    error?: boolean;
    modelValue: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    class: '',
    disabled: false,
    error: false,
  });

  const mergedClass = computed(() => {
    return {
      [props.class]: props.class !== '',
      'select-error': props.error,
    };
  });

  const selectValue = computed({
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
  <select
    v-model="selectValue"
    class="select select-bordered w-full max-w-xs"
    :class="mergedClass"
    :disabled="disabled"
  >
    <slot />
  </select>
</template>
