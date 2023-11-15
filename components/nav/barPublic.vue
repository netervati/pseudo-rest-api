<script lang="ts" setup>
  import { Bars3Icon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <Bars3Icon class="h-6 w-6" />
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><NuxtLink to="/docs">Docs</NuxtLink></li>
          <li><NuxtLink to="https://github.com/netervati/pseudo-rest-api">Source</NuxtLink></li>
        </ul>
      </div>
      <NuxtLink class="btn btn-ghost normal-case text-xl" to="/">
        <img width="200" src="/full-logo.png" />
      </NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><NuxtLink to="/docs">Docs</NuxtLink></li>
        <li><NuxtLink to="https://github.com/netervati/pseudo-rest-api">Source</NuxtLink></li>
      </ul>
    </div>
    <div class="navbar-end"></div>
  </div>
</template>
