<script setup lang="ts">
  import { ArrowRightCircleIcon } from '@heroicons/vue/24/outline';

  definePageMeta({
    layout: 'blank',
  });
</script>

<template>
  <NavBarPublic />
  <section class="flex flex-col h-screen gap-3">
    <header class="flex flex-col m-auto text-center w-5/6 md:w-3/6">
      <h1 class="font-bold text-3xl md:text-6xl"><span class="bg-gray-300">API Mocking</span> Made Simple for Everyone.</h1>
      <p class="mt-8 md:text-xl">Build, tweak, and test your mock REST APIs with ease. We'll serve those endpoints for you.</p>
      <div class="flex m-auto">
        <NuxtLink
          class="btn mt-4 gap-x-2 font-normal text-md md:text-2xl normal-case"
          to="/dashboard"
        >
          <span>Get Started</span>
          <ArrowRightCircleIcon class="h-6 w-6" />
        </NuxtLink>
      </div>
    </header>
    <Footer />
  </section>
</template>
