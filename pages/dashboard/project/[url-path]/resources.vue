<script lang="ts" setup>
  import ModalCreateResourceModel from '~~/components/modal/createResourceModel.vue';
  import { useResourceDataType, useResourceModel } from '~~/stores';

  definePageMeta({
    middleware: ['auth', 'validate-project'],
  });

  useResourceDataType();

  const resourceModel = useResourceModel();

  const createModal = useModal(ModalCreateResourceModel, {
    id: 'create-resouce-model',
  });
</script>

<template>
  <div class="p-6">
    <ResourceContainer>
      <Button
        :disabled="resourceModel.isDisabled"
        color="success"
        size="sm"
        @click="createModal.open"
      >
        New Resource Model
      </Button>
    </ResourceContainer>
    <ClientOnly>
      <component :is="createModal.component" />
    </ClientOnly>
  </div>
</template>
