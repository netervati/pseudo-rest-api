<script lang="ts" setup>
  const emit = defineEmits(['click']);

  type Props = {
    isActive?: boolean;
  };

  const props = withDefaults(defineProps<Props>(), {
    isActive: false,
  });

  const mergedClass = computed(() => {
    return {
      'bg-gray-300': props.isActive,
    };
  });
</script>

<template>
  <span
    class="cursor-pointer ease-out duration-300 grow hover:bg-zinc-300 p-2 rounded-lg"
    :class="mergedClass"
    @click="emit('click')"
  >
    <slot />
  </span>
</template>
