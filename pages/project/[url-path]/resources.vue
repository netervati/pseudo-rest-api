<script lang="ts" setup>
  import ModalCreateResourceModel from '~~/components/modal/createResourceModel.vue';

  definePageMeta({
    middleware: 'auth',
  });

  const refresh = ref(Date.now());

  const modal = useModal(ModalCreateResourceModel, {
    id: 'create-resouce-model',
    onSuccess: () => {
      refresh.value = Date.now();
    },
  });
</script>

<template>
  <div class="p-6">
    <Button color="success" size="sm" @click="modal.open">
      New Resource Model
    </Button>
    <ResourceTable :refresh="refresh" />
    <ClientOnly>
      <modal.component />
    </ClientOnly>
  </div>
</template>
