<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'click', params?: string): void;
  }>();

  type Props = {
    isActive?: boolean;
    color?: '' | 'error' | 'ghost' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    loading?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit';
  };

  const props = withDefaults(defineProps<Props>(), {
    isActive: false,
    color: '',
    disabled: false,
    loading: false,
    size: 'md',
    type: 'button',
  });

  type ClassLibrary = { [key: string]: string | undefined };

  const COLORS: ClassLibrary = {
    error: 'btn-error',
    ghost: 'btn-ghost',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
  };

  const SIZES: ClassLibrary = {
    md: 'btn-md',
    lg: 'btn-lg',
    sm: 'btn-sm',
    xs: 'btn-xs',
  };

  const mergedClass = computed(() => {
    const btnColor = COLORS[props.color] ?? '';
    const btnSize = SIZES[props.size] ?? '';

    return {
      [btnColor]: btnColor !== '',
      [btnSize]: btnSize !== '',
      loading: props.loading,
      'btn-active': props.isActive,
    };
  });
</script>

<template>
  <button
    class="btn normal-case font-normal text-lg"
    :class="mergedClass"
    :disabled="loading || disabled"
    :type="type"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
