<template>
  <main class="flex justify-content">
    <section class="bg-base-100 w-16">
      <SideBar />
    </section>
    <section class="bg-base-100 w-full">
      <NavBar />
      <slot />
    </section>
  </main>
</template>
