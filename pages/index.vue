<script lang="ts" setup>
  import ModalCreateProject from '~~/components/modal/createProject.vue';
  import {
    useApiStore,
    useProjectStore,
    useResourceDataTypeStore,
    useResourceModelStore,
  } from '~~/stores';

  definePageMeta({
    middleware: 'auth',
  });

  useApiStore().clear();
  useResourceDataTypeStore().clear();
  useResourceModelStore().clear();

  const project = useProjectStore();
  const isDisabled = computed(
    () => project.list.length === 2 || project.isLoading
  );
  const secretKey = ref('');
  const toast = useToast();

  const modal = useModal(ModalCreateProject, {
    id: 'create-project',
    onSuccess: async (key: string) => {
      secretKey.value = key;

      await project.fetch({ mutateCache: true });
    },
  });

  onMounted(async () => {
    await project.fetch();

    const loading = useLocalStorage('pra-login', false);

    if (loading.value) {
      loading.value = false;

      toast.dark('Successfully signed in');
    }
  });
</script>

<template>
  <ClientOnly>
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
      <component :is="modal.component" />
    </div>
  </ClientOnly>
</template>
