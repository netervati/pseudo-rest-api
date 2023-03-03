<script lang="ts" setup>
  import ModalCreateResourceModel from '~~/components/modal/createResourceModel.vue';

  definePageMeta({
    middleware: 'auth',
  });

  const modal = useModal(ModalCreateResourceModel, {
    id: 'create-resouce-model',
  });
</script>

<template>
  <div class="p-6">
    <Button color="success" size="sm" @click="modal.open">
      New Resource Model
    </Button>
    <ClientOnly>
      <modal.component />
    </ClientOnly>
  </div>
</template>
