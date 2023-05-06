<script lang="ts" setup>
  import EditApi from '../modal/editApi.vue';
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

  const dispatch = (action: string, data: Api) => {
    switch (action) {
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
                  color="success"
                  size="xs"
                  @click="dispatch('edit', record)"
                >
                  Edit
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
      <component :is="editApiModal.component" />
    </ClientOnly>
  </div>
</template>
