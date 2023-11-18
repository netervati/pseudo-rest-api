<script setup lang="ts">
  defineProps({
    href: {
      type: String,
      default: '',
    },
    target: {
      type: String,
      default: undefined,
      required: false,
    },
  });
</script>

<template>
  <NuxtLink
    :href="href"
    :target="target"
    class="decoration-2 font-bold text-violet-600 underline underline-offset-2"
  >
    <slot />
  </NuxtLink>
</template>
