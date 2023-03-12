<script lang="ts" setup>
  import ModalCreateResourceData from '../modal/createResourceData.vue';
  import { useResourceDataStore, useResourceModelStore } from '~~/stores';

  const resourceData = useResourceDataStore();
  const resourceModel = useResourceModelStore();

  const modal = useModal(ModalCreateResourceData, {
    id: 'create-resource-data',
    onSuccess: () => {
      // add refresh
    },
  });

  const handleClick = () => {
    console.log('CLICKED');
    modal.open();
  };
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
              @click="handleClick"
            >
              New Data
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td />
        </tr>
      </tbody>
    </table>
    <ClientOnly>
      <modal.component />
    </ClientOnly>
  </div>
</template>
