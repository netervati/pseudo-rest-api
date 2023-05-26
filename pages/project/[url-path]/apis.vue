<script lang="ts" setup>
  import ModalCreateApi from '~~/components/modal/createApi.vue';
  import useApiStore from '~~/stores/useApiStore';
  import validateProject from '~~/middleware/validateProject';

  definePageMeta({
    middleware: ['auth'],
  });

  const apis = useApiStore();
  const projectApiKey = useProjectApiKey();

  const modal = useModal(ModalCreateApi, {
    id: 'create-api',
    onSuccess: async () => {
      await apis.fetch(projectApiKey);
    },
  });

  onMounted(async () => await validateProject());
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
