<script lang="ts" setup>
  import ModalCreateProject from '~~/components/modal/createProject.vue';
  import {
    useApStore,
    useProjectStore,
    useResourceDataTypeStore,
    useResourceModelStore,
  } from '~~/stores';

  definePageMeta({
    middleware: 'auth',
  });

  useApStore().clear();
  useResourceDataTypeStore().clear();
  useResourceModelStore().clear();

  const project = useProjectStore();
  const secretKey = ref('');

  onMounted(async () => {
    if (project.list.length === 0) {
      await project.fetch();
    }
  });

  const modal = useModal(ModalCreateProject, {
    id: 'create-project',
    onSuccess: async (key: string) => {
      secretKey.value = key;
      await project.fetch();
    },
  });
</script>

<template>
  <div class="p-6">
    <Button color="success" size="sm" @click="modal.open">New Project</Button>
    <ProjectSecretKeyBox :secret-key="secretKey" />
    <ProjectGrid />
    <ClientOnly>
      <component :is="modal.component" />
    </ClientOnly>
  </div>
</template>
