<script lang="ts" setup>
  import {
    ArrowRightOnRectangleIcon,
    BookOpenIcon,
    UserIcon,
  } from '@heroicons/vue/24/outline';

  const client = useSupabaseAuthClient();
  const toast = useToast();

  const handleLogout = async () => {
    toast.dark('Signing out...');

    await client.auth.signOut();

    navigateTo('/login');

    toast.dark('Successfully signed out');
  };

  const redirectToWiki = () => {
    navigateTo('/docs');
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
      <Dropdown avatar class="rounded-lg" color="ghost" position="end">
        <template #label>
          <UserIcon class="h-4 m-auto w-4" />
        </template>
        <template #options>
          <DropdownOption
            v-for="(opts, idx) in dropdownOptions"
            :key="idx"
            @click="opts.fn"
          >
            <component :is="opts.icon" class="h-4 w-4" />
            {{ opts.text }}
          </DropdownOption>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
