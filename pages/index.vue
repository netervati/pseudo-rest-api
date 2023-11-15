<script setup lang="ts">
  definePageMeta({
    layout: 'blank',
  });
</script>

<template>
  <NavBarPublic />
  <section class="flex flex-col md:flex-row gap-3 p-2 md:p-8">
    <LandingPageCode />
    <header class="m-auto">
      <h1 class="font-bold text-4xl md:text-6xl">Intuitive way to mock REST endpoints</h1>
      <p class="mt-8 text-lg md:text-2xl">Build your own fake REST APIs without having to learn any programming language or framework</p>
    </header>
  </section>
  <Footer />
</template>
