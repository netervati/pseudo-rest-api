<script lang="ts" setup>
  defineProps<{
    tabindex: string;
  }>();
</script>

<template>
  <ul
    :tabindex="tabindex"
    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
  >
    <slot />
  </ul>
</template>
