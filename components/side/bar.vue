<script lang="ts" setup>
  import { HomeIcon, ServerStackIcon } from '@heroicons/vue/24/outline';

  const iconClass = 'h-4 w-4';
  const route = useRoute();

  const links = computed(() => {
    const base = [{ name: 'Home', to: '/' }];

    if (route.path.includes('apis') && route.params.urlpath !== null) {
      base.push(
        ...[{ name: 'APIs', to: `/project/${route.params.urlpath}/apis` }]
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
      <Button color="ghost" @click="navigateTo(link.to)">
        <HomeIcon v-if="link.name === 'Home'" :class="iconClass" />
        <ServerStackIcon v-if="link.name === 'APIs'" :class="iconClass" />
      </Button>
    </div>
  </div>
</template>
