<script lang="ts" setup>
  import { ProjectWithProjectKey } from '~~/types/models';

  const props = defineProps<{
    secretKey: string;
  }>();

  const { secretKey } = toRefs(props);
  const toast = useToast();

  const { data, error, refresh } = await useFetch<ProjectWithProjectKey[]>(
    '/projects',
    {
      method: 'get',
    }
  );

  watch(error, (fetchError) => {
    if (fetchError) {
      toast.show(fetchError.statusMessage ?? 'Failed to retrieve projects', {
        color: 'error',
      });
    }
  });

  const projects = computed<ProjectWithProjectKey[]>(() => data.value || []);

  onMounted(async () => await nextTick(refresh));
  watch(secretKey, refresh);

  const handleOpen = (urlPath: string) => {
    navigateTo(`/project/${urlPath}/apis`);
  };
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
