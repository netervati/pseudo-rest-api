<script setup lang="ts">
  import { ArrowUpRightIcon, Bars3Icon } from '@heroicons/vue/24/solid';

  const docLinks = [
    { link: '/docs', text: 'Home' },
    { link: '/docs/getting-started', text: 'Getting Started' },
    { link: '/docs/http-methods', text: 'HTTP Methods' },
  ];
</script>

<template>
  <div class="drawer drawer-mobile">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <nav class="bg-base-100 border-b border-gray-300 navbar">
        <div class="flex-1">
          <label for="my-drawer-2" class="btn btn-ghost btn-sm drawer-button lg:hidden">
            <Bars3Icon class="h-6 w-6" />
          </label>
          <LogoLink class="md:hidden" to="/docs" />
        </div>
        <div class="navbar-end hidden md:flex">
          <NuxtLink
            class="btn btn-ghost gap-x-2 font-normal normal-case"
            to="/dashboard"
          >
            Dashboard
            <ArrowUpRightIcon class="w-4 h-4" />
          </NuxtLink>
          <NuxtLink
            class="btn btn-ghost font-normal normal-case"
            to="https://github.com/netervati/pseudo-rest-api"
          >
            Source
          </NuxtLink>
        </div>
      </nav>
      <slot />
    </div> 
    <div class="drawer-side border-r border-slate-300">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <ul class="p-4 w-80 bg-base-100 text-base-content">
        <li class="hidden md:flex">
          <LogoLink class="w-full" to="/docs" />
        </li>
        <li v-for="doc in docLinks" :key="doc.link">
          <NuxtLink
            :to="doc.link"
            class="btn btn-ghost font-normal normal-case text-lg w-full justify-start"
          >
            {{ doc.text }}
          </NuxtLink>
        </li>
        <li class="p-6"><hr /></li>
        <li>
          <NuxtLink
            class="btn btn-ghost gap-x-2 font-normal normal-case text-lg w-full justify-start"
            to="/dashboard"
          >
            Dashboard
            <ArrowUpRightIcon class="w-4 h-4" />
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            class="btn btn-ghost font-normal normal-case text-lg w-full justify-start"
            to="https://github.com/netervati/pseudo-rest-api"
          >
            Source
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
