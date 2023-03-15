<script lang="ts" setup>
  import ModalCreateResourceData from '../modal/createResourceData.vue';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  const resourceModel = useResourceModelStore();
  const refreshKey = ref(Date.now());

  const structure = computed(() => {
    const list = resourceModel.list.filter(
      // @ts-ignore
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
</script>

<template>
  <div class="overflow-auto h-96">
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
      <ResourceDataTableBody
        :key="refreshKey"
        :model-id="resourceModel.target"
      />
    </table>
    <ClientOnly>
      <modal.component />
    </ClientOnly>
  </div>
</template>
