<script lang="ts" setup>
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
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img src="@/assets/images/empty-profile.png" />
          </div>
        </label>
        <NavProfileDropdown>
          <NavProfileDropdownButton @click="handleLogout">
            logout
          </NavProfileDropdownButton>
        </NavProfileDropdown>
      </div>
    </div>
  </div>
</template>
