<script lang="ts" setup>
  const props = defineProps<{
    refreshKey: number;
  }>();

  type Project = {
    id: string;
    description: string;
    name: string;
    url_path: string;
  };

  const { refreshKey } = toRefs(props);
  const projects = ref<APIBody<Project>[] | []>([]);
  const toast = useToast();

  const handleOpen = (urlPath: string) => {
    navigateTo(`/project/${urlPath}/apis`);
  };

  const handleRequest = async () => {
    const { data, error } = await useFetch<APIBodyArray<Project>>('/projects', {
      method: 'get',
    });

    if (error.value) {
      const message = error.value.statusMessage;

      toast.show(message ? titleize(message) : 'Failed to retrieve projects', {
        color: 'error',
      });
    }

    if (data.value) {
      projects.value = data.value.data;
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
      :key="project.attributes.id"
      class="card border border-gray-300 hover:bg-gray-300"
      @click="handleOpen(project.attributes.url_path)"
    >
      <div class="card-body cursor-pointer">
        <h3 class="font-bold">{{ project.attributes.name }}</h3>
      </div>
    </article>
  </section>
</template>
