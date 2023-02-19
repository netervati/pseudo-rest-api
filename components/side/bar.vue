<script lang="ts" setup>
  import { HomeIcon, ServerStackIcon } from '@heroicons/vue/24/outline';

  const links = [
    { name: 'Home', to: '/' },
    { name: 'APIs', to: '/apis' },
  ];

  const iconClass = 'h-4 w-4';
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
        <HomeIcon v-if="link.to === '/'" :class="iconClass" />
        <ServerStackIcon v-if="link.to === '/apis'" :class="iconClass" />
      </Button>
    </div>
  </div>
</template>
