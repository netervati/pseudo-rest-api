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
  <h3 :class="mergedClass" class="font-bold pb-3 pt-3 text-xl"><slot /></h3>
</template>
