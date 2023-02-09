<script lang="ts" setup>
  import classBuilder from '../utils/classBuilder';

  type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
  type ButtonType = 'button' | 'submit';

  type Props = {
    class?: string | undefined;
    disabled?: boolean;
    loading?: boolean;
    size?: ButtonSize;
    type?: ButtonType;
  };

  const emit = defineEmits<{
    (e: 'click'): void;
  }>();

  const props = withDefaults(defineProps<Props>(), {
    class: undefined,
    disabled: false,
    loading: false,
    size: 'md',
    type: 'button',
  });

  const { class: className, disabled, loading, size } = toRefs(props);

  const mergedClass = computed(() =>
    classBuilder(`btn btn-${size.value}`, {
      [`${className}`]: typeof className === 'string',
      loading: loading.value,
    })
  );
</script>

<template>
  <button
    :class="mergedClass"
    :disabled="loading || disabled"
    :type="type"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
