<script setup lang="ts">
  definePageMeta({
    layout: 'blank',
  });

  const config = useRuntimeConfig();
  const user = useSupabaseUser();
  const { auth } = useSupabaseAuthClient();
  const { data } = await auth.getSession();
  const signIn = useSignInProgress();

  onMounted(() => {
    signIn.process(data.session === null);

    watchEffect(() => {
      if (user.value) {
        navigateTo('/');
      }
    });
  });

  const getURL = () => {
    let url =
      config.public.siteUrl !== ''
        ? config.public.siteUrl
        : config.public.testUrl;

    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

    return url;
  };

  const handleClick = () => {
    auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: getURL(),
      },
    });

    signIn.begin();
  };
</script>

<template>
  <ClientOnly>
    <section class="bg-base-300 flex h-screen">
      <article class="bg-base-100 card m-auto p-8 shadow-xl w-96">
        <img src="/full-logo.png" />
        <h4 class="font-bold mt-6 text-xl">Welcome!</h4>
        <p>Please sign in to your account.</p>
        <Button
          class="mt-16"
          :loading="signIn.loading.value"
          @click="handleClick"
        >
          Sign in with Github
        </Button>
      </article>
    </section>
  </ClientOnly>
</template>
