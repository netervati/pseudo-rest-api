<script lang="ts" setup>
  import ModalCreateResourceData from '../modal/createResourceData.vue';
  import ModalConfirm from '~~/components/modal/confirm.vue';
  import { useResourceData, useResourceModel } from '~~/stores';

  const resourceData = useResourceData();
  const resourceModel = useResourceModel();
  const select = useSelect();

  const structure = computed(() => {
    const list = resourceModel.list.filter(
      (target) => target.id === resourceModel.target
    );

    if (list.length === 1) {
      return list[0].structure;
    }
  });

  const loaderColSpan = computed(
    () => Object.keys(structure.value || {}).length + 2
  );

  const modal = useModal(ModalCreateResourceData, {
    id: 'create-resource-data',
  });

  const deleteModal = useModal(ModalConfirm, {
    id: 'confirm-delete-resource-data',
    onConfirm: async (closeModal: () => void) => {
      const ids = Array.from(select.list.value).join(',');

      await resourceData.bulkDelete(ids);

      closeModal();

      select.clear();
    },
  });

  onMounted(() => {
    select.clear();
  });

  watchEffect(async () => {
    if (resourceModel.target !== '') {
      await resourceData.setResourceModelId(resourceModel.target);
      select.clear();
    }
  });
</script>

<template>
  <div class="overflow-y-scroll" style="height: 70vh">
    <table class="table w-full">
      <thead>
        <tr>
          <th>
            <input
              :checked="select.ticked(resourceData.list)"
              class="checkbox"
              type="checkbox"
              @click="select.tick(resourceData.list)"
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
          <th v-for="header in structure" :key="header!.id">
            {{ header!.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <TableLoader v-if="resourceData.isLoading" :colspan="loaderColSpan" />
        <tr v-for="record in resourceData.list" v-else :key="record.id">
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
