<script lang="ts" setup>
  const config = useRuntimeConfig();

  if (config.public.onMaintenance) {
    throw createError({
      statusCode: 503,
      statusMessage:
        "Sorry, the site is down for a bit of maintenance right now. But we'll back later!",
    });
  }

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
