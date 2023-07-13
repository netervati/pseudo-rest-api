<script lang="ts" setup>
  import EditApi from '../modal/editApi.vue';
  import ModalConfirm from '../modal/confirm.vue';
  import useApi from '~~/stores/useApi';
  import useResourceModel from '~~/stores/useResourceModel';
  import { Api } from '~~/types/models';

  useResourceModel();

  const api = useApi();
  const deps = reactive({ target: '' });

  const editApiModal = useModal(EditApi, {
    id: 'edit-api',
    deps,
    onClose: () => {
      deps.target = '';
    },
  });

  const deleteApiModal = useModal(ModalConfirm, {
    id: 'confirm-delete-api',
    onConfirm: async (closeModal: () => void) => {
      await api.delete(deps.target);

      closeModal();

      await api.refresh();

      deps.target = '';
    },
  });

  const dispatch = (action: string, data: Api) => {
    deps.target = data.id;

    switch (action) {
      case 'delete':
        deleteApiModal.open();

        break;
      case 'edit':
        editApiModal.open();

        break;
      default:
        break;
    }
  };
</script>

<template>
  <div class="mt-4">
    <div class="overflow-y-scroll" style="height: 70vh">
      <table class="table w-full">
        <thead>
          <tr>
            <th />
            <th>Path</th>
            <th>Resource</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <TableLoader v-if="api.isLoading" :colspan="4" />
          <tr v-for="record in api.list" v-else :key="record.id">
            <td>
              <Button
                class="mr-1"
                color="success"
                size="xs"
                @click="dispatch('edit', record)"
              >
                Edit
              </Button>
              <Button
                class="ml-1"
                color="error"
                size="xs"
                @click="dispatch('delete', record)"
              >
                Delete
              </Button>
            </td>
            <td>{{ record.url_path }}</td>
            <td>{{ record.resource_models.name }}</td>
            <td>{{ record.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <ClientOnly>
      <component
        :is="deleteApiModal.component"
        content="Are you sure you want to delete this api?"
      />
      <component :is="editApiModal.component" />
    </ClientOnly>
  </div>
</template>
