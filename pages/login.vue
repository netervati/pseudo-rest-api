<script setup lang="ts">
  const user = useSupabaseUser();
  const { auth } = useSupabaseAuthClient();

  watchEffect(() => {
    if (user.value) {
      navigateTo('/');
    }
  });
</script>

<template>
  <section class="bg-base-300 flex h-screen">
    <article class="bg-base-100 card m-auto p-6 shadow-xl w-96">
      <button
        class="btn"
        type="button"
        @click="auth.signInWithOAuth({ provider: 'github' })"
      >
        Sign in with Github
      </button>
    </article>
  </section>
</template>
