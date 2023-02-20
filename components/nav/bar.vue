<script lang="ts" setup>
  import {
    ArrowRightOnRectangleIcon,
    UserIcon,
  } from '@heroicons/vue/24/outline';

  const client = useSupabaseAuthClient();

  const handleLogout = async () => {
    await client.auth.signOut();

    navigateTo('/login');
  };
</script>

<template>
  <div class="bg-base-100 border-b border-gray-300 navbar">
    <div class="flex-1">
      <NuxtLink class="btn btn-ghost normal-case text-xl" to="/">
        PseudoRESTAPI
      </NuxtLink>
    </div>
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <label
          class="avatar border-gray-300 btn btn-ghost rounded-lg"
          tabindex="0"
        >
          <UserIcon class="h-4 m-auto w-4" />
        </label>
        <NavProfileDropdown>
          <NavProfileDropdownButton @click="handleLogout">
            <ArrowRightOnRectangleIcon class="h-4 w-4" /> logout
          </NavProfileDropdownButton>
        </NavProfileDropdown>
      </div>
    </div>
  </div>
</template>
