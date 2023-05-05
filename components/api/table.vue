<script lang="ts" setup>
  import useApiStore from '~~/stores/useApiStore';

  const api = useApiStore();
  const projectApiKey = useProjectApiKey() || '';

  onMounted(async () => {
    await api.fetch(projectApiKey);
  });
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
              <td />
              <td>{{ record.url_path }}</td>
              <td>{{ record.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
