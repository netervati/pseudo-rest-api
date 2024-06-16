<script lang="ts" setup>
  import { InformationCircleIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <h3 class="text-lg font-bold">
    <slot></slot>
    <div
      class="tooltip tooltip-bottom"
      data-tip="The model's name is case-sensitive. If you input &quot;Users&quot;, then the URL path for that model will be &quot;\Users&quot;."
    >
      <InformationCircleIcon class="ml-2 w-4 h-4" />
    </div>
  </h3>
</template>
