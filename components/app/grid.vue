<script lang="ts" setup>
  import useApp from '~~/stores/useApp';
  import { AppWithAppKey } from '~~/types/models';

  const appStore = useApp();

  const handleOpen = (app: AppWithAppKey) => {
    /**
      We can directly assign the app to the target here
      to reduce backend requests.
    */
    appStore.setTarget(app);

    navigateTo(`/dashboard/app/${app.app_keys[0].api_key}/models`);
  };
</script>

<template>
  <section class="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
    <article
      v-for="app in appStore.list"
      :key="app.id"
      class="card border border-gray-300 hover:bg-gray-300"
      @click="handleOpen(app)"
    >
      <div class="card-body cursor-pointer">
        <h3 class="text-lg font-medium">{{ app.title }}</h3>
      </div>
    </article>
  </section>
</template>
