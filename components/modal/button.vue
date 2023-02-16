<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'click'): void;
  }>();

  type Props = {
    class?: string;
    color?: '' | 'error' | 'info' | 'success' | 'warning';
    size?: 'xs' | 'sm' | 'md' | 'lg';
  };

  const props = withDefaults(defineProps<Props>(), {
    class: '',
    color: '',
    size: 'md',
  });

  type ClassLibrary = { [key: string]: string | undefined };

  const COLORS: ClassLibrary = {
    error: 'btn-error',
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
      [props.class]: props.class !== '',
    };
  });
</script>

<template>
  <label class="btn" :class="mergedClass" @click="emit('click')">
    <slot />
  </label>
</template>
