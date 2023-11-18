<script lang="ts" setup>
  import ModalCreateModel from '~~/components/modal/createModel.vue';
  import useModel from '~~/stores/useModel';

  definePageMeta({
    middleware: ['auth', 'validate-app'],
  });

  const model = useModel();
  const createModal = useModal(ModalCreateModel, { id: 'create-model' });
</script>

<template>
  <div class="p-6">
    <ModelGrid>
      <Button
        color="success"
        :disabled="model.isDisabled"
        size="sm"
        @click="createModal.open"
      >
        New Model
      </Button>
    </ModelGrid>
    <ClientOnly>
      <component :is="createModal.component" />
    </ClientOnly>
  </div>
</template>
