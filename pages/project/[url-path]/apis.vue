<script lang="ts" setup>
  import ModalCreateApi from '~~/components/modal/createApi.vue';
  import useApiStore from '~~/stores/useApiStore';

  definePageMeta({
    middleware: ['auth', 'validate-project'],
  });

  const apis = useApiStore();
  const isDisabled = computed(() => apis.list.length === 5 || apis.isLoading);
  const modal = useModal(ModalCreateApi, { id: 'create-api' });
</script>

<template>
  <div class="p-6">
    <Button
      :disabled="isDisabled"
      color="success"
      size="sm"
      @click="modal.open"
    >
      New API
    </Button>
    <ApiTable />
    <ClientOnly>
      <component :is="modal.component" />
    </ClientOnly>
  </div>
</template>
