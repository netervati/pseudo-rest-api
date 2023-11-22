<script setup lang="ts">
  import { useRuntimeConfig } from '#imports';

  defineProps<{ id?: string }>();

  const heading = 2;
  const { anchorLinks } = useRuntimeConfig().public.content;
  const generate =
    anchorLinks?.depth >= heading && !anchorLinks?.exclude.includes(heading);
</script>

<template>
  <h2
    :id="id"
    class="font-bold mt-6 mb-6 md:mb-8 md:mt-8 text-lg md:text-xl"
  >
    <a v-if="id && generate" :href="`#${id}`">
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
