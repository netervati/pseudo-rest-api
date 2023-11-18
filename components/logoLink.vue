<script setup lang="ts">
  type Props = {
    to?: string;
  };

  const props = withDefaults(defineProps<Props>(), {
    to: '/',
  });
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="btn btn-ghost gap-x-2 normal-case text-xl"
  >
    <img width="36" src="/logo.png" /> PseudoRESTAPI
  </NuxtLink>
</template>
