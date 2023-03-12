<script lang="ts" setup>
  import { ChevronRightIcon } from '@heroicons/vue/24/outline';
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
  <div class="flex mt-4">
    <div class="border card h-96 pr-6 w-1/4">
      <div class="card-body">
        <article
          v-for="model in resourceModel.list"
          :key="model.id"
          class="grid grid-cols-2 w-full"
        >
          <span class="m-2 mb-2">{{ model.name }}</span>
          <span>
            <div class="dropdown float-right w-1/2">
              <Button color="ghost" tabindex="0" class="m-1 w-full" size="sm">
                <ChevronRightIcon class="h-4 w-4" />
              </Button>
              <DropdownMenu tabindex="0">
                <Option size="xs" @click="handleDelete(model.id)">
                  Delete
                </Option>
              </DropdownMenu>
            </div>
          </span>
        </article>
      </div>
    </div>
    <div class="pl-6 w-3/4">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th><Button color="success" size="xs">New Data</Button></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ClientOnly>
      <modal.component>
        Are you sure you want to delete the resource model?
      </modal.component>
    </ClientOnly>
  </div>
</template>
