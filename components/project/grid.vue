<script lang="ts" setup>
  import useProject from '~~/stores/useProject';
  import { ProjectWithProjectKey } from '~~/types/models';

  const projectStore = useProject();

  const handleOpen = (project: ProjectWithProjectKey) => {
    /**
      We can directly assign the project to the target here
      to reduce backend requests.
    */
    projectStore.target = project;

    navigateTo(`/project/${project.project_keys[0].api_key}/apis`);
  };
</script>

<template>
  <section class="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
    <article
      v-for="project in projectStore.list"
      :key="project.id"
      class="card border border-gray-300 hover:bg-gray-300"
      @click="handleOpen(project)"
    >
      <div class="card-body cursor-pointer">
        <h3 class="font-bold">{{ project.name }}</h3>
      </div>
    </article>
  </section>
</template>
