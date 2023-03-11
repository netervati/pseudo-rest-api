<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'click'): void;
  }>();

  type Props = {
    size?: 'xs' | 'sm' | 'md' | 'lg';
  };

  const props = withDefaults(defineProps<Props>(), {
    size: 'md',
  });

  type ClassLibrary = { [key: string]: string | undefined };

  const SIZES: ClassLibrary = {
    md: 'text-base',
    lg: 'text-lg',
    sm: 'text-sm',
    xs: 'text-xs',
  };

  const mergedClass = computed(() => {
    const itemSize = SIZES[props.size] ?? '';

    return {
      [itemSize]: itemSize !== '',
    };
  });
</script>

<template>
  <li :class="mergedClass">
    <a @click="emit('click')"><slot /></a>
  </li>
</template>
