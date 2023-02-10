<script lang="ts" setup>
  const emit = defineEmits(['click']);
</script>

<template>
  <li>
    <a class="justify-between" @click="emit('click')">
      <slot />
    </a>
  </li>
</template>
