<script lang="ts" setup>
  import ModalCreateResourceModel from '~~/components/modal/createResourceModel.vue';
  import validateProject from '~~/middleware/validateProject';

  definePageMeta({
    middleware: ['auth'],
  });

  const refresh = ref(Date.now());

  const createModal = useModal(ModalCreateResourceModel, {
    id: 'create-resouce-model',
    onSuccess: () => {
      refresh.value = Date.now();
    },
  });

  onMounted(async () => await validateProject());
</script>

<template>
  <div class="p-6">
    <Button color="success" size="sm" @click="createModal.open">
      New Resource Model
    </Button>
    <ResourceTable :refresh="refresh" />
    <ClientOnly>
      <component :is="createModal.component" />
    </ClientOnly>
  </div>
</template>
