<script setup lang="ts">
  import { useRuntimeConfig } from '#imports';

  defineProps<{ id?: string }>();

  const heading = 1;
  const { anchorLinks } = useRuntimeConfig().public.content;
  const generate =
    anchorLinks?.depth >= heading && !anchorLinks?.exclude.includes(heading);
</script>

<template>
  <h1
    :id="id"
    class="font-bold mt-6 mb-6 md:mb-8 md:mt-8 text-2xl md:text-3xl"
  >
    <a v-if="id && generate" :href="`#${id}`">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>
