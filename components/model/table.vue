<script lang="ts" setup>
  import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline';
  import useModelData from '~~/stores/useModelData';
  import ModalCreateModelData from '~~/components/modal/createModelData.vue';
  import ModalConfirm from '~~/components/modal/confirm.vue';

  defineProps<{
    schema: { name: string; type: string }[];
  }>();

  const modelData = useModelData();
  const select = useSelect();

  const createModelDataModal = useModal(ModalCreateModelData, { id: 'create-model-data' });

  const deleteModelDataModal = useModal(ModalConfirm, {
    id: 'confirm-delete-model-data',
    onConfirm: async (closeModal: () => void) => {
      const ids = Array.from(select.list.value).join(',');

      await modelData.bulkDelete(ids);

      closeModal();

      select.clear();
    },
  });
</script>

<template>
  <div class="mt-4">
    <div class="overflow-y-scroll" style="height: 70vh">
      <table class="table w-full">
        <thead>
          <tr>
            <th>
              <input
                :checked="select.ticked(modelData.list)"
                class="checkbox"
                type="checkbox"
                @click="select.tick(modelData.list)"
              />
            </th>
            <th>
              <div class="flex gap-x-2">
                <Button
                  v-if="!select.isEmpty.value"
                  :disabled="modelData.isLoading"
                  color="error"
                  size="sm"
                  @click="deleteModelDataModal.open()"
                >
                  <TrashIcon class="w-4 h-4" />
                </Button>
                <Button
                  v-if="select.isEmpty.value"
                  :disabled="modelData.isLoading"
                  color="success"
                  size="sm"
                  @click="createModelDataModal.open()"
                >
                  <PlusIcon class="w-4 h-4" />
                </Button>
              </div>
            </th>
            <th
              v-for="sch in schema"
              class="font-normal normal-case text-base"
            >
              {{ sch.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <TableLoader v-if="modelData.isLoading" :colspan="4" />
          <tr v-for="md in modelData.list" v-else :key="md.id">
            <td colspan="2">
              <input
                :checked="select.ticked(md.id)"
                class="checkbox"
                type="checkbox"
                @click="select.tick(md.id)"
              />
            </td>
            <td
              v-for="sch in schema"
              class="font-normal normal-case text-base"
            >
              {{ md.schema[sch.name as any] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ClientOnly>
      <component :is="createModelDataModal.component" />
      <component
        :is="deleteModelDataModal.component"
        content="Are you sure you want to delete the selected model data?"
      />
    </ClientOnly>
  </div>
</template>
