<script lang="ts" setup>
  definePageMeta({
    middleware: 'auth',
  });
</script>

<template>
  <div class="p-6">
    <Button color="success" size="sm">New Project</Button>
  </div>
</template>
