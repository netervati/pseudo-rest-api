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
      This is your project's secret key. You will only see this once so make
      sure to copy this!
    </p>
    <div class="mt-2">
      <input class="bg-emerald-300 input w-full" readonly :value="secretKey" />
    </div>
  </article>
</template>
