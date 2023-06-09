<script lang="ts" setup>
  import ModalConfirm from '~~/components/modal/confirm.vue';
  import ModalCreateResourceData from '../modal/createResourceData.vue';
  import useResourceDataStore from '~~/stores/useResourceDataStore';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  const projectApiKey = useProjectApiKey();
  const resourceData = useResourceDataStore();
  const resourceModel = useResourceModelStore();
  const refreshKey = ref(Date.now());
  const select = useSelect();

  const structure = computed(() => {
    const list = resourceModel.list.filter(
      (target) => target.id === resourceModel.target
    );

    if (list.length === 1) {
      return list[0].structure;
    }
  });

  const modal = useModal(ModalCreateResourceData, {
    id: 'create-resource-data',
    onSuccess: () => {
      refreshKey.value = Date.now();
    },
  });

  const deleteModal = useModal(ModalConfirm, {
    id: 'confirm-delete-resource-data',
    onConfirm: async (closeModal: () => void) => {
      await resourceData.bulkDelete({
        ids: Array.from(select.list.value).join(','),
        projectApiKey,
        resourceModelId: resourceModel.target,
      });

      closeModal();
      resourceData.clear(resourceModel.target);
      await resourceData.fetch(projectApiKey, resourceModel.target);

      select.clear();
    },
  });

  onMounted(async () => {
    select.clear();

    if (
      resourceModel.target !== '' &&
      resourceData.list[resourceModel.target].length === 0
    ) {
      await resourceData.fetch(projectApiKey, resourceModel.target);
    }
  });

  onUnmounted(() => {
    resourceData.clear(resourceModel.target);
  });

  watchEffect(() => {
    if (resourceModel.target !== '') {
      resourceData.fetch(projectApiKey, resourceModel.target);
      select.clear();
    }
  });
</script>

<template>
  <div class="overflow-auto h-96">
    <table class="table w-full">
      <thead>
        <tr>
          <th v-if="resourceModel.target === ''" />
          <th v-else class="flex flex-col">
            <Button class="m-1" color="success" size="xs" @click="modal.open">
              New Data
            </Button>
            <Button class="m-1" color="error" size="xs" @click="deleteModal.open">
              Delete Data
            </Button>
          </th>
          <th v-for="header in structure" :key="header!.id">
            {{ header!.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <TableLoader v-if="resourceData.isLoading" :colspan="4" />
        <tr
          v-for="record in resourceData.list[resourceModel.target]"
          v-else
          :key="record.id"
        >
          <td>
            <input
              :checked="false"
              class="checkbox"
              type="checkbox"
              @click="select.tick(record.id)"
            />
          </td>
          <td v-for="[key, value] in Object.entries(record.data)" :key="key">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
    <ClientOnly>
      <modal.component />
      <component
        :is="deleteModal.component"
        content="Are you sure you want to delete this resource data?"
      />
    </ClientOnly>
  </div>
</template>
