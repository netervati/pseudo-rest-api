<script lang="ts" setup>
  import EditApi from '../modal/editApi.vue';
  import ModalConfirm from '../modal/confirm.vue';
  import useApiStore from '~~/stores/useApiStore';
  import { Api } from '~~/types/models';

  const api = useApiStore();
  const projectApiKey = useProjectApiKey() || '';

  const deps = reactive({
    target: '',
  });

  onMounted(async () => {
    await api.fetch(projectApiKey);
  });

  const editApiModal = useModal(EditApi, {
    id: 'edit-api',
    deps,
    onClose: () => {
      deps.target = '';
    },
    onSuccess: async () => {
      api.clear();
      await api.fetch(projectApiKey);
    },
  });

  const deleteApiModal = useModal(ModalConfirm, {
    id: 'confirm-delete-api',
    onConfirm: async (callback: () => void) => {
      await api.delete({
        id: deps.target,
        projectApiKey,
      });

      callback();

      api.clear();
      await api.fetch(projectApiKey);

      deps.target = '';
    },
  });

  const dispatch = (action: string, data: Api) => {
    switch (action) {
      case 'delete':
        deps.target = data.id;
        deleteApiModal.open();

        break;
      case 'edit':
        deps.target = data.id;
        editApiModal.open();

        break;
      default:
        break;
    }
  };
</script>

<template>
  <div class="flex mt-4">
    <div class="h-72 w-full">
      <div class="overflow-auto h-96">
        <table class="table w-full">
          <thead>
            <tr>
              <th />
              <th>Path</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in api.list" :key="record.id">
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
              <td>{{ record.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
