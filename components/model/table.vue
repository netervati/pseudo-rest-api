<script lang="ts" setup>
  import useModelData from '~~/stores/useModelData';
  import ModalCreateModelData from '~~/components/modal/createModelData.vue';

  defineProps<{
    schema: { name: string; type: string }[];
  }>();

  const modelData = useModelData();
  const createModelDataModal = useModal(ModalCreateModelData, { id: 'create-model-data' });
</script>

<template>
  <div class="mt-4">
    <div class="overflow-y-scroll" style="height: 70vh">
      <table class="table w-full">
        <thead>
          <tr>
            <th>
              <Button
                :disabled="modelData.isLoading"
                size="sm"
                @click="createModelDataModal.open()"
              >
                Generate
              </Button>
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
            <td />
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
    </ClientOnly>
  </div>
</template>
