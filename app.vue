<script lang="ts" setup>
  onMounted(() => {
    const element = document.createElement('div');
    element.setAttribute('id', 'modal-container');
    document.body.append(element);

    return element;
  });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
