<script lang="ts" setup>
  defineProps<{
    secretKey: string;
  }>();
</script>

<template>
  <article
    v-if="secretKey.trim() !== ''"
    class="bg-emerald-400 p-8 rounded-lg mt-4"
  >
    <p>
      Below is your project's secret key. Make sure to copy this as you will
      only see this once!
    </p>
    <div class="mt-2">
      <input class="bg-emerald-300 input w-full" :value="secretKey" />
    </div>
  </article>
</template>
