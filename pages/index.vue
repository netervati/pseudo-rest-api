<script setup lang="ts">
  import {
    ArrowRightCircleIcon,
    CircleStackIcon,
    LockClosedIcon,
    SparklesIcon
  } from '@heroicons/vue/24/outline';

  definePageMeta({
    layout: 'blank',
  });
</script>

<template>
  <NavBarPublic />
  <section class="flex flex-col justify-center gap-3">
    <header class="flex flex-col m-auto text-center mt-48 w-5/6 md:w-3/6">
      <h1 class="font-bold text-3xl md:text-6xl">Fastest Way to Build a <span class="bg-gray-300">REST API</span> for Testing.</h1>
      <p class="mt-8 md:text-xl">Deploy within minutes and test it with your frontend code.</p>
      <div class="flex gap-6 m-auto">
        <NuxtLink
          class="btn mt-4 gap-x-2 font-normal text-md md:text-2xl normal-case"
          to="/dashboard"
        >
          <span>Get Started</span>
        </NuxtLink>
        <NuxtLink
          class="btn btn-ghost mt-4 gap-x-2 font-normal text-md md:text-2xl normal-case"
          to="/docs"
        >
          <span>Learn more</span>
          <ArrowRightCircleIcon class="h-6 w-6" />
        </NuxtLink>
      </div>
    </header>
    <section class="flex flex-col items-center mt-32 gap-4 p-20">
      <h2 class="font-medium text-2xl md:text-4xl">Our Features</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 gap-8">
        <article class="border border-slate-300 flex-1 text-center rounded-lg p-8">
          <h3 class="font-medium gap-4 text-xl md:text-2xl">
            <CircleStackIcon class="text-blue-500 inline-block w-6 h-6" /> Data customization
          </h3>
          <p class="mt-4">
            Define the schema of the resource that you want to expose
            and populate it with data.
          </p>
        </article>
        <article class="border border-slate-300 flex-1 text-center rounded-lg p-8">
          <h3 class="font-medium gap-4 text-xl md:text-2xl">
            <SparklesIcon class="text-yellow-500 inline-block w-6 h-6" />
            Hassle-free setup
          </h3>
          <p class="mt-4">
            All of your APIs support GET, POST, PUT, and DELETE requests
            out-of-the-box!
          </p>
        </article>
        <article class="border border-slate-300 flex-1 text-center rounded-lg p-8">
          <h3 class="font-medium gap-4 text-xl md:text-2xl">
            <LockClosedIcon class="text-emerald-500 inline-block w-6 h-6" />
            Secure Access
          </h3>
          <p class="mt-4">
            Generate and utilize security keys to limit the access
            to your endpoints.
          </p>
        </article>
        <article class="flex md:col-span-3 mt-4 text-center text-lg">
          <p class="m-auto">And more coming soon...</p>
        </article>
      </div>
    </section>
    <section class="flex flex-col gap-4 m-auto mb-32 mt-28 md:w-3/6 text-center w-5/6">
      <h3 class="font-medium text-lg md:text-2xl">
        Do you feel like a feature is missing? Did you find any
        issues while using this platform?
      </h3>
      <p>
        If so, feel free to submit an issue or open a pull-request on the project's
        <a class="font-bold text-violet-600 underline" href="https://github.com/netervati/pseudo-rest-api">repository</a>. We'll try to review your submission and accommodate
        it if it's within the project's scope or vision.
      </p>
    </section>
    <Footer />
  </section>
</template>
