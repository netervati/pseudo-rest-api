<script lang="ts" setup>
  import ModalCreateResourceData from '../modal/createResourceData.vue';
  import { useResourceDataStore, useResourceModelStore } from '~~/stores';

  const resourceData = useResourceDataStore();
  const resourceModel = useResourceModelStore();
  const structure = computed(() => {
    // @ts-ignore
    const list = resourceModel.list.filter(
      (target) => target.id === resourceModel.target
    );

    if (list.length === 1) {
      return list[0].structure;
    }
  });

  const projectApiKey = useProjectApiKey() || '';

  const modal = useModal(ModalCreateResourceData, {
    id: 'create-resource-data',
  });

  onMounted(async () => {
    if (resourceModel.target !== '' && resourceData.list.length === 0) {
      await resourceData.fetch({
        projectApiKey,
        resourceModelId: resourceModel.target,
      });
    }
  });

  onUnmounted(() => {
    resourceData.clear();
  });

  watchEffect(() => {
    if (resourceModel.target !== '') {
      resourceData.fetch({
        projectApiKey,
        resourceModelId: resourceModel.target,
      });
    }
  });
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>
            <Button
              v-if="resourceModel.target !== ''"
              color="success"
              size="xs"
              @click="modal.open"
            >
              New Data
            </Button>
          </th>
          <th v-for="header in structure" :key="header!.id">
            {{ header!.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in resourceData.list" :key="record.id">
          <td />
          <td
            v-for="// @ts-ignore
              [key, value] in Object.entries(record.data)"
            :key="key"
          >
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
    <ClientOnly>
      <modal.component />
    </ClientOnly>
  </div>
</template>
