<script lang="ts" setup>
  import ModalCreateResourceData from '../modal/createResourceData.vue';
  import { useResourceModelStore } from '~~/stores';

  const resourceModel = useResourceModelStore();

  const modal = useModal(ModalCreateResourceData, {
    id: 'create-resource-data',
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
