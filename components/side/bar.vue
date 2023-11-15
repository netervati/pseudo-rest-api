<script lang="ts" setup>
  import {
    CircleStackIcon,
    HomeIcon,
    ServerStackIcon,
    WrenchScrewdriverIcon,
  } from '@heroicons/vue/24/outline';

  const route = useRoute();

  const links = computed(() => {
    const base = [{ name: 'Home', icon: HomeIcon, to: '/dashboard' }];

    if (route.path.includes('project') && route.params.urlpath !== null) {
      base.push(
        ...[
          {
            name: 'APIs',
            icon: ServerStackIcon,
            to: `/dashboard/project/${route.params.urlpath}/apis`,
          },
          {
            name: 'Resources',
            icon: CircleStackIcon,
            to: `/dashboard/project/${route.params.urlpath}/resources`,
          },
          {
            name: 'Settings',
            icon: WrenchScrewdriverIcon,
            to: `/dashboard/project/${route.params.urlpath}/settings`,
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
      :data-tip="link.name"
      class="mr-auto ml-auto mt-2 tooltip tooltip-bottom"
    >
      <Button
        color="ghost"
        :is-active="route.path === link.to"
        @click="navigateTo(link.to)"
      >
        <component :is="link.icon" class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
