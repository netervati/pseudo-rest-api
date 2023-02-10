<script lang="ts" setup>
  defineProps<{
    to: string;
  }>();
</script>

<template>
  <li>
    <NuxtLink class="justify-between" :to="to">
      <slot />
    </NuxtLink>
  </li>
</template>
