<script lang="ts" setup>
  import ModalConfirm from '~~/components/modal/confirm.vue';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  const props = defineProps<{
    refresh: number;
  }>();

  const { refresh } = toRefs(props);
  const projectApiKey = useProjectApiKey() || '';
  const resourceModel = useResourceModelStore();
  const targetResourceModel = ref('');

  const modal = useModal(ModalConfirm, {
    id: 'confirm-delete-resource-model',
    onConfirm: async () => {
      await resourceModel.delete({
        id: targetResourceModel.value,
        projectApiKey,
      });

      await resourceModel.fetch(projectApiKey);
    },
  });

  onMounted(async () => {
    if (resourceModel.list.length === 0) {
      await resourceModel.fetch(projectApiKey);
    }
  });

  watch(refresh, async () => {
    await resourceModel.fetch(projectApiKey);
  });

  const handleDelete = (id: string) => {
    targetResourceModel.value = id;
    modal.open();
  };
</script>

<template>
  <div class="mt-2 overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Resource Model</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="model in resourceModel.list" :key="model.id">
          <td>{{ model.name }}</td>
          <td>
            <Button color="error" size="sm" @click="handleDelete(model.id)">
              Delete
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
    <ClientOnly>
      <modal.component>
        Are you sure you want to delete the resource model?
      </modal.component>
    </ClientOnly>
  </div>
</template>
