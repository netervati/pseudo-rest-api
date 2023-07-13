<script lang="ts" setup>
  import ModalCreateResourceModel from '~~/components/modal/createResourceModel.vue';
  import useResourceDataTypeStore from '~~/stores/useResourceDataTypeStore';
  import useResourceModel from '~~/stores/useResourceModel';

  definePageMeta({
    middleware: ['auth', 'validate-project'],
  });

  const resourceDataType = useResourceDataTypeStore();
  const resourceModel = useResourceModel();

  useMountedFetch([resourceDataType]);

  const createModal = useModal(ModalCreateResourceModel, {
    id: 'create-resouce-model',
  });
</script>

<template>
  <div class="p-6">
    <ResourceTable>
      <Button
        :disabled="resourceModel.isDisabled"
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
