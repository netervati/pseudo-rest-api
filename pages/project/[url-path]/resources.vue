<script lang="ts" setup>
  import ModalCreateResourceModel from '~~/components/modal/createResourceModel.vue';
  import validateProject from '~~/middleware/validateProject';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  definePageMeta({
    middleware: ['auth'],
  });

  const resourceModel = useResourceModelStore();
  const isDisabled = computed(
    () => resourceModel.list.length === 5 || resourceModel.isLoading
  );
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
    <Button
      :disabled="isDisabled"
      color="success"
      size="sm"
      @click="createModal.open"
    >
      New Resource Model
    </Button>
    <ResourceTable :refresh="refresh" />
    <ClientOnly>
      <component :is="createModal.component" />
    </ClientOnly>
  </div>
</template>
