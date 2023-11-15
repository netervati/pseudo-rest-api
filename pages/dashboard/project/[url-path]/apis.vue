<script lang="ts" setup>
  import ModalCreateApi from '~~/components/modal/createApi.vue';
  import useApi from '~~/stores/useApi';

  definePageMeta({
    middleware: ['auth', 'validate-project'],
  });

  const api = useApi();
  const createModal = useModal(ModalCreateApi, { id: 'create-api' });
</script>

<template>
  <div class="p-6">
    <Button
      :disabled="api.isDisabled"
      color="success"
      size="sm"
      @click="createModal.open"
    >
      New API
    </Button>
    <ApiTable />
    <ClientOnly>
      <component :is="createModal.component" />
    </ClientOnly>
  </div>
</template>
