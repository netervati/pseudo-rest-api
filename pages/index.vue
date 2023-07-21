<script lang="ts" setup>
  import ModalCreateProject from '~~/components/modal/createProject.vue';
  import useProject from '~~/stores/useProject';

  definePageMeta({
    middleware: 'auth',
  });

  const project = useProject();
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
      :disabled="project.isDisabled"
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
