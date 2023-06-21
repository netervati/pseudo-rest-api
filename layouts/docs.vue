<script setup lang="ts">
  import { Bars3Icon } from '@heroicons/vue/24/solid';

  const docLinks = [
    { link: '/docs', text: 'Home' },
    { link: '/docs/introduction', text: 'Introduction' },
    { link: '/docs/getting-started', text: 'Getting Started' },
    { link: '/docs/api-reference', text: 'API Reference' },
  ];
</script>

<template>
  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <nav class="bg-base-100 border-b border-gray-300 navbar">
        <div class="flex-1">
          <label for="my-drawer" class="btn btn-ghost btn-sm drawer-button">
            <Bars3Icon class="h-6 w-6" />
          </label>
        </div>
        <div class="flex-none" />
      </nav>
      <slot />
    </div>
    <div class="drawer-side">
      <label for="my-drawer" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 h-full bg-base-200 text-base-content">
        <li v-for="doc in docLinks" :key="doc.link">
          <NuxtLink :to="doc.link">{{ doc.text }}</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
