<script lang="ts" setup>
  import ModalConfirm from '~~/components/modal/confirm.vue';
  import useResourceDataStore from '~~/stores/useResourceDataStore';

  const props = defineProps<{
    modelId: string;
  }>();

  const projectApiKey = useProjectApiKey();
  const resourceData = useResourceDataStore();
  const resourceDataId = ref<string>('');

  const deleteModal = useModal(ModalConfirm, {
    id: 'confirm-delete-resource-data',
    onConfirm: async (closeModal: () => void) => {
      await resourceData.delete({
        id: resourceDataId.value,
        projectApiKey,
        resourceModelId: props.modelId,
      });

      closeModal();
      resourceData.clear(props.modelId);
      await resourceData.fetch(projectApiKey, props.modelId);

      resourceDataId.value = '';
    },
  });

  onMounted(async () => {
    if (props.modelId !== '' && resourceData.list[props.modelId].length === 0) {
      await resourceData.fetch(projectApiKey, props.modelId);
    }
  });

  onUnmounted(() => {
    resourceData.clear(props.modelId);
  });

  watchEffect(() => {
    if (props.modelId !== '') {
      resourceData.fetch(projectApiKey, props.modelId);
    }
  });

  const handleOpen = (id: string) => {
    resourceDataId.value = id;
    deleteModal.open();
  };
</script>

<template>
  <tbody>
    <tr v-if="resourceData.isLoading">
      <td colspan="4">
        <div class="flex h-full w-full">
          <LoaderSpinner />
        </div>
      </td>
    </tr>
    <tr v-for="record in resourceData.list[modelId]" v-else :key="record.id">
      <td>
        <Button color="error" size="xs" @click="handleOpen(record.id)">
          Delete
        </Button>
      </td>
      <td v-for="[key, value] in Object.entries(record.data)" :key="key">
        {{ value }}
      </td>
    </tr>
    <ClientOnly>
      <component
        :is="deleteModal.component"
        content="Are you sure you want to delete this resource data?"
      />
    </ClientOnly>
  </tbody>
</template>
