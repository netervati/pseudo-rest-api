<script setup lang="ts">
  definePageMeta({
    layout: 'blank',
  });

  preloadRouteComponents('/dashboard');

  const signIn = useSignIn();
</script>

<template>
  <ClientOnly>
    <section class="bg-base-300 flex h-screen">
      <article class="bg-base-100 card m-auto p-8 shadow-xl w-96">
        <LogoLink />
        <h4 class="font-bold mt-6 text-xl">Welcome!</h4>
        <p>Please sign in to your account.</p>
        <Button
          class="mt-16"
          :loading="signIn.isLoading.value"
          @click="signIn.Oauth"
        >
          Sign in with Github
        </Button>
      </article>
    </section>
  </ClientOnly>
</template>
