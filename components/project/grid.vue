<script lang="ts" setup>
  import useProjectStore from '~~/stores/useProjectStore';

  const projects = useProjectStore();

  const handleOpen = (urlPath: string) => {
    navigateTo(`/project/${urlPath}/apis`);
  };
</script>

<template>
  <section class="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
    <article
      v-for="project in projects.list"
      :key="project.id"
      class="card border border-gray-300 hover:bg-gray-300"
      @click="handleOpen(project.project_keys[0].api_key)"
    >
      <div class="card-body cursor-pointer">
        <h3 class="font-bold">{{ project.name }}</h3>
      </div>
    </article>
  </section>
</template>
