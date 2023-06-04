<script setup lang="ts">
  import { H3Error } from 'h3';
  import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

  defineProps<{
    error: H3Error;
  }>();
</script>

<template>
  <div class="flex w-screen h-screen">
    <section class="m-auto text-center text-xl">
      <p>
        <ExclamationTriangleIcon class="m-auto w-8 h-8" />
        {{ error.statusMessage }}
      </p>
    </section>
  </div>
</template>
