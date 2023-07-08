<script lang="ts" setup>
  import ModalCreateResourceModel from '~~/components/modal/createResourceModel.vue';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  definePageMeta({
    middleware: ['auth', 'validate-project'],
  });

  const resourceModel = useResourceModelStore();
  const isDisabled = computed(
    () => resourceModel.list.length === 5 || resourceModel.isLoading
  );

  const createModal = useModal(ModalCreateResourceModel, {
    id: 'create-resouce-model',
  });
</script>

<template>
  <div class="p-6">
    <ResourceTable>
      <Button
        :disabled="isDisabled"
        color="success"
        size="sm"
        @click="createModal.open"
      >
        New Resource Model
      </Button>
    </ResourceTable>
    <ClientOnly>
      <component :is="createModal.component" />
    </ClientOnly>
  </div>
</template>
