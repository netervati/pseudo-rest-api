<script lang="ts" setup>
  import ModalCreateApi from '~~/components/modal/createApi.vue';

  definePageMeta({
    middleware: 'auth',
  });

  const modal = useModal(ModalCreateApi, {
    id: 'create-api',
  });
</script>

<template>
  <div class="p-6">
    <Button color="success" size="sm" @click="modal.open">New API</Button>
    <ApiTable />
    <ClientOnly>
      <modal.component />
    </ClientOnly>
  </div>
</template>
