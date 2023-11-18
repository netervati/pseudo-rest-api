<script lang="ts" setup>
  import { Bars3Icon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="navbar absolute bg-base-100 p-4">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <Bars3Icon class="h-6 w-6" />
        </label>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
        >
          <li><NuxtLink to="/docs">Docs</NuxtLink></li>
          <li><NuxtLink to="https://github.com/netervati/pseudo-rest-api">Source</NuxtLink></li>
        </ul>
      </div>
      <LogoLink />
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="flex gap-x-8 px-1">
        <li><NuxtLink to="/docs">Docs</NuxtLink></li>
        <li><NuxtLink to="https://github.com/netervati/pseudo-rest-api">Source</NuxtLink></li>
      </ul>
    </div>
    <div class="navbar-end"></div>
  </div>
</template>
