<script lang="ts" setup>
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
  <ul :class="mergedClass" class="list-disc list-inside">
    <slot />
  </ul>
</template>
