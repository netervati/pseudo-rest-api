<script setup lang="ts">
  const curYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer border-b-8 border-violet-600 items-center p-6 md:text-lg">
    <aside class="items-center grid-flow-col">
      <p>© {{ curYear }} PseudoRESTAPI - All rights reserved.</p>
    </aside> 
    <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
      <p>Built by <NuxtLink class="text-violet-600 font-bold" to="https://www.christophertabula.net/">Christopher Tabula</NuxtLink></p>
    </nav>
  </footer>
</template>
