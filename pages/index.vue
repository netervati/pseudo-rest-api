<script lang="ts" setup>
  definePageMeta({
    middleware: 'auth',
  });

  const client = useSupabaseAuthClient();

  const handleLogout = async () => {
    await client.auth.signOut();

    navigateTo('/login');
  };
</script>

<template>
  <section>
    <button @click="handleLogout">Sign Out</button>
    Protected
  </section>
</template>
