<script setup lang="ts">
  definePageMeta({
    layout: 'blank',
  });

  const user = useSupabaseUser();
  const { auth } = useSupabaseAuthClient();
  const loading = ref(false);

  watchEffect(() => {
    if (user.value) {
      navigateTo('/');
    }
  });

  const handleClick = () => {
    auth.signInWithOAuth({ provider: 'github' });
    loading.value = true;
  };
</script>

<template>
  <section class="bg-base-300 flex h-screen">
    <article class="bg-base-100 card m-auto p-6 shadow-xl w-96">
      <Button :loading="loading" @click="handleClick">
        Sign in with Github
      </Button>
    </article>
  </section>
</template>
