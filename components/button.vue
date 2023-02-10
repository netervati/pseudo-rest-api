<script lang="ts" setup>
  type Props = {
    color?: '' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    loading?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit';
  };

  const emit = defineEmits<{
    (e: 'click'): void;
  }>();

  const props = withDefaults(defineProps<Props>(), {
    color: '',
    disabled: false,
    loading: false,
    size: 'md',
    type: 'button',
  });

  type ClassProps = { [key: string]: string | undefined };

  const COLORS: ClassProps = {
    error: 'btn-error',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
  };

  const SIZES: ClassProps = {
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
    };
  });
</script>
a
<template>
  <button
    :class="mergedClass"
    :disabled="loading || disabled"
    :type="type"
    class="btn"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
