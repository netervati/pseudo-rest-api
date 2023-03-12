<script lang="ts" setup>
  import ModalConfirm from '~~/components/modal/confirm.vue';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  const props = defineProps<{
    refresh: number;
  }>();

  const { refresh } = toRefs(props);
  const projectApiKey = useProjectApiKey() || '';
  const resourceModel = useResourceModelStore();

  const state = reactive({
    deleting: false,
    target: '',
  });

  const modal = useModal(ModalConfirm, {
    id: 'confirm-delete-resource-model',
    onConfirm: async (callback) => {
      await resourceModel.delete({
        id: state.target,
        projectApiKey,
      });

      callback();

      resourceModel.clear();
      await resourceModel.fetch(projectApiKey);

      state.target = '';
    },
  });

  onMounted(async () => {
    if (resourceModel.list.length === 0) {
      await resourceModel.fetch(projectApiKey);
    }
  });

  watch(refresh, async () => {
    await resourceModel.fetch(projectApiKey);
  });

  const handleDelete = (id: string) => {
    state.target = id;
    modal.open();
  };
</script>

<template>
  <div class="mt-4 overflow-x-auto">
    <div class="border card h-96 w-1/4">
      <div class="card-body">
        <article
          v-for="model in resourceModel.list"
          :key="model.id"
          class="w-full"
        >
          <div class="dropdown w-full">
            <Button color="ghost" tabindex="0" class="m-1 w-full" size="sm">
              {{ model.name }}
            </Button>
            <DropdownMenu tabindex="0">
              <Option size="xs" @click="handleDelete(model.id)">
                Delete
              </Option>
            </DropdownMenu>
          </div>
        </article>
      </div>
    </div>
    <ClientOnly>
      <modal.component>
        Are you sure you want to delete the resource model?
      </modal.component>
    </ClientOnly>
  </div>
</template>
