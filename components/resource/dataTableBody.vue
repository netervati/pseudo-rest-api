<script lang="ts" setup>
  import ModalConfirm from '~~/components/modal/confirm.vue';
  import useResourceDataStore from '~~/stores/useResourceDataStore';

  const props = defineProps<{
    modelId: string;
  }>();

  const projectApiKey = useProjectApiKey();
  const resourceData = useResourceDataStore();
  const resourceDataId = ref<string>('');

  const modal = useModal(ModalConfirm, {
    id: 'confirm-delete-resource-data',
    onConfirm: async (callback: () => void) => {
      await resourceData.delete({
        id: resourceDataId.value,
        projectApiKey,
        resourceModelId: props.modelId,
      });

      callback();
      resourceData.clear(props.modelId);

      await resourceData.fetch({
        projectApiKey,
        resourceModelId: props.modelId,
      });

      resourceDataId.value = '';
    },
  });

  onMounted(async () => {
    if (props.modelId !== '' && resourceData.list[props.modelId].length === 0) {
      await resourceData.fetch({
        projectApiKey,
        resourceModelId: props.modelId,
      });
    }
  });

  onUnmounted(() => {
    resourceData.clear(props.modelId);
  });

  watchEffect(() => {
    if (props.modelId !== '') {
      resourceData.fetch({
        projectApiKey,
        resourceModelId: props.modelId,
      });
    }
  });

  const handleOpen = (id: string) => {
    resourceDataId.value = id;
    modal.open();
  };
</script>

<template>
  <tbody>
    <tr v-for="record in resourceData.list[modelId]" :key="record.id">
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
        :is="modal.component"
        content="Are you sure you want to delete this resource data?"
      />
    </ClientOnly>
  </tbody>
</template>
