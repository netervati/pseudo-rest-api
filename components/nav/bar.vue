<script lang="ts" setup>
  import {
    ArrowRightOnRectangleIcon,
    BookOpenIcon,
    UserIcon,
  } from '@heroicons/vue/24/outline';

  const client = useSupabaseAuthClient();
  const toast = useToast();

  const handleLogout = async () => {
    toast.neutral('Signing out...');

    await client.auth.signOut();

    navigateTo('/login');

    toast.neutral('Successfully signed out');
  };

  const redirectToWiki = () => {
    window.location.href =
      'https://github.com/netervati/pseudo-rest-api/blob/main/docs/README.md';
  };

  const dropdownOptions = [
    {
      icon: BookOpenIcon,
      fn: redirectToWiki,
      text: 'docs',
    },
    {
      icon: ArrowRightOnRectangleIcon,
      fn: handleLogout,
      text: 'logout',
    },
  ];
</script>

<template>
  <div class="bg-base-100 border-b border-gray-300 navbar">
    <div class="flex-1">
      <NuxtLink class="btn btn-ghost normal-case text-xl" to="/">
        <img width="200" src="/full-logo.png" />
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
          <NavProfileDropdownButton
            v-for="(opts, idx) in dropdownOptions"
            :key="idx"
            @click="opts.fn"
          >
            <component :is="opts.icon" class="h-4 w-4" />
            {{ opts.text }}
          </NavProfileDropdownButton>
        </NavProfileDropdown>
      </div>
    </div>
  </div>
</template>
