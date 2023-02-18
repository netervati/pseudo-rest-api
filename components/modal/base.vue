<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  type Props = {
    id: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
  };

  const props = withDefaults(defineProps<Props>(), {
    size: 'sm',
  });

  type ClassLibrary = { [key: string]: string | undefined };

  const SIZES: ClassLibrary = {
    md: '',
    lg: 'w-11/12 max-w-5xl',
    sm: 'relative',
    xs: '',
  };

  const mergedClass = computed(() => {
    const modalSize = SIZES[props.size] ?? '';

    return {
      [modalSize]: modalSize !== '',
    };
  });
</script>

<template>
  <Teleport to="body">
    <input :id="id" type="checkbox" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box" :class="mergedClass">
        <Button
          class="btn-circle absolute right-2 top-2"
          size="sm"
          @click="emit('close')"
        >
          ✕
        </Button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
