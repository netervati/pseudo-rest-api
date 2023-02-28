<script lang="ts" setup>
  import { ProjectWithProjectKey } from '~~/types/models';

  const props = defineProps<{
    refreshKey: number;
  }>();

  const { refreshKey } = toRefs(props);
  const projects = ref<ProjectWithProjectKey[]>([]);
  const toast = useToast();

  const handleOpen = (urlPath: string) => {
    navigateTo(`/project/${urlPath}/apis`);
  };

  const handleRequest = async () => {
    const { data, error } = await useFetch<ProjectWithProjectKey[]>(
      '/projects',
      {
        method: 'get',
      }
    );

    if (error.value) {
      const message =
        error.value.statusMessage ?? 'Failed to retrieve projects';

      toast.show(titleize(message), {
        color: 'error',
      });
    }

    if (data.value) {
      projects.value = data.value;
    }
  };

  onMounted(() => {
    nextTick(async () => {
      await handleRequest();
    });
  });

  watch(refreshKey, async () => {
    await handleRequest();
  });
</script>

<template>
  <section class="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4">
    <article
      v-for="project in projects"
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
