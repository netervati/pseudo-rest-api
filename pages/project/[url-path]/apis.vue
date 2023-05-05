<script lang="ts" setup>
  import ModalCreateApi from '~~/components/modal/createApi.vue';

  definePageMeta({
    middleware: 'auth',
  });

  const refresh = ref(Date.now());

  const modal = useModal(ModalCreateApi, {
    id: 'create-api',
    onSuccess: () => {
      refresh.value = Date.now();
    },
  });
</script>

<template>
  <div class="p-6">
    <Button color="success" size="sm" @click="modal.open">New API</Button>
    <ApiTable :key="refresh" />
    <ClientOnly>
      <modal.component />
    </ClientOnly>
  </div>
</template>
