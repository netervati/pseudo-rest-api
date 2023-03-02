<script lang="ts" setup>
  import {
    CircleStackIcon,
    HomeIcon,
    ServerStackIcon,
  } from '@heroicons/vue/24/outline';

  const iconClass = 'h-4 w-4';
  const route = useRoute();

  const links = computed(() => {
    const base = [{ name: 'Home', icon: HomeIcon, to: '/' }];

    if (route.path.includes('apis') && route.params.urlpath !== null) {
      base.push(
        ...[
          {
            name: 'APIs',
            icon: ServerStackIcon,
            to: `/project/${route.params.urlpath}/apis`,
          },
          {
            name: 'Resources',
            icon: CircleStackIcon,
            to: `/projects/${route.params.urlpath}/resources`,
          },
        ]
      );
    }

    return base;
  });
</script>

<template>
  <div
    class="border-r border-gray-300 h-screen shadow-xl flex flex-col items-start"
  >
    <div
      v-for="link in links"
      :key="link.to"
      class="mr-auto ml-auto mt-2 tooltip tooltip-right"
      :data-tip="link.name"
    >
      <Button
        color="ghost"
        :is-active="route.path === link.to"
        @click="navigateTo(link.to)"
      >
        <component :is="link.icon" :class="iconClass" />
      </Button>
    </div>
  </div>
</template>
