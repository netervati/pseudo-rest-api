<script lang="ts" setup>
  import ModalCreateProject from '~~/components/modal/createProject.vue';
  import {
    useApStore,
    useResourceDataTypeStore,
    useResourceModelStore,
  } from '~~/stores';

  definePageMeta({
    middleware: 'auth',
  });

  useApStore().clear();
  useResourceDataTypeStore().clear();
  useResourceModelStore().clear();

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
    <Button color="success" size="sm" @click="modal.open">New Project</Button>
    <ProjectSecretKeyBox :secret-key="secretKey" />
    <ProjectGrid :secret-key="secretKey" />
    <ClientOnly>
      <modal.component />
    </ClientOnly>
  </div>
</template>
