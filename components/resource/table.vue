<script lang="ts" setup>
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  const props = defineProps<{
    refresh: number;
  }>();

  const { refresh } = toRefs(props);
  const projectApiKey = useProjectApiKey() || '';
  const resourceModel = useResourceModelStore();

  onMounted(async () => {
    if (resourceModel.list.length === 0) {
      await resourceModel.fetch(projectApiKey);
    }
  });

  watch(refresh, async () => {
    await resourceModel.fetch(projectApiKey);
  });
</script>

<template>
  <div class="mt-2 overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Resource Model</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="model in resourceModel.list" :key="model.id">
          <td>{{ model.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
