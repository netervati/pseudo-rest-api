<script setup lang="ts">
  definePageMeta({ auth: false });

  const { signIn } = useSession();
</script>

<template>
  <section class="bg-base-300 flex h-screen">
    <article class="bg-base-100 card m-auto p-6 shadow-xl w-96">
      <button class="btn" type="button" @click="signIn('github')">
        Sign in using Github
      </button>
    </article>
  </section>
</template>
