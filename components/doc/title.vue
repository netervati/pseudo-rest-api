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
  <h1 :class="mergedClass" class="font-bold pb-3 pt-3 text-2xl"><slot /></h1>
</template>
