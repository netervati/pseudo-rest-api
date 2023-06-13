<script lang="ts" setup>
  defineProps<{
    to: string;
  }>();
</script>

<template>
  <NuxtLink
    class="decoration-2 font-bold text-success underline underline-offset-2"
    :to="to"
  >
    <slot />
  </NuxtLink>
</template>
