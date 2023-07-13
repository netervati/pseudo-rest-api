<script lang="ts" setup>
  import ModalCreateProject from '~~/components/modal/createProject.vue';
  import {
    useApiStore,
    useProject,
    useResourceDataTypeStore,
    useResourceModelStore,
  } from '~~/stores';

  definePageMeta({
    middleware: 'auth',
  });

  useApiStore().clear();
  useResourceDataTypeStore().clear();
  useResourceModelStore().clear();

  const project = useProject();
  const isDisabled = computed(
    () => project.list.length === 2 || project.isLoading
  );
  const secretKey = ref('');

  const modal = useModal(ModalCreateProject, {
    id: 'create-project',
    onSuccess: (key: string) => {
      secretKey.value = key;
    },
  });
</script>

<template>
  <div class="p-6">
    <Button
      :disabled="isDisabled"
      color="success"
      size="sm"
      @click="modal.open"
    >
      New Project
    </Button>
    <ProjectSecretKeyBox :secret-key="secretKey" />
    <ProjectGrid />
    <ClientOnly>
      <component :is="modal.component" />
    </ClientOnly>
  </div>
</template>
