<script setup lang="ts">
  interface Props {
    class?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    class: '',
  });

  const mergedClass = computed(() => {
    return {
      [props.class]: props.class !== '',
    };
  });
</script>

<template>
  <p :class="mergedClass" class="pb-3 pt-3"><slot /></p>
</template>
