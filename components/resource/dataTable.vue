<script lang="ts" setup>
  import ModalConfirm from '~~/components/modal/confirm.vue';
  import ModalCreateResourceData from '../modal/createResourceData.vue';
  import useResourceDataStore from '~~/stores/useResourceDataStore';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  const projectApiKey = useProjectApiKey();
  const resourceData = useResourceDataStore();
  const resourceModel = useResourceModelStore();
  const select = useSelect();

  const resourceDataList = computed(
    () => resourceData.list[resourceModel.target]
  );

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
    onSuccess: async () => {
      await resourceData.fetch(projectApiKey, resourceModel.target);
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

    if (resourceModel.target !== '' && resourceDataList.value.length === 0) {
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
          <template v-else>
            <th>
              <input
                :checked="select.ticked(resourceDataList)"
                class="checkbox"
                type="checkbox"
                @click="select.tick(resourceDataList)"
              />
            </th>
            <th>
              <Dropdown :disabled="resourceData.isLoading" size="sm">
                <template #label>Manage Data</template>
                <template #options>
                  <DropdownOption @click="modal.open">New</DropdownOption>
                  <DropdownOption
                    v-if="!select.isEmpty.value"
                    @click="deleteModal.open"
                  >
                    Delete
                  </DropdownOption>
                </template>
              </Dropdown>
            </th>
          </template>
          <th v-for="header in structure" :key="header!.id">
            {{ header!.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <TableLoader v-if="resourceData.isLoading" :colspan="4" />
        <tr v-for="record in resourceDataList" v-else :key="record.id">
          <td colspan="2">
            <input
              :checked="select.ticked(record.id)"
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
      <component :is="modal.component" />
      <component
        :is="deleteModal.component"
        content="Are you sure you want to delete the selected resource data?"
      />
    </ClientOnly>
  </div>
</template>
