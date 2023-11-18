<script lang="ts" setup>
  import useApp from '~~/stores/useApp';
  import { AppWithAppKey } from '~~/types/models';

  const appStore = useApp();

  const handleOpen = (app: AppWithAppKey) => {
    /**
      We can directly assign the app to the target here
      to reduce backend requests.
    */
    appStore.target = app;

    navigateTo(`/dashboard/app/${app.app_keys[0].app_key}/`);
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
        <h3 class="font-bold">{{ app.title }}</h3>
      </div>
    </article>
  </section>
</template>
