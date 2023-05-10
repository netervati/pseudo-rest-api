<script lang="ts" setup>
  import { ChevronRightIcon } from '@heroicons/vue/24/outline';
  import EditResourceModel from '../modal/editResourceModel.vue';
  import ModalConfirm from '../modal/confirm.vue';
  import { useResourceDataStore, useResourceModelStore } from '~~/stores';
  import { ResourceModel } from '~~/types/models';

  const props = defineProps<{
    refresh: number;
  }>();

  const { refresh } = toRefs(props);
  const projectApiKey = useProjectApiKey() || '';
  const resourceData = useResourceDataStore();
  const resourceModel = useResourceModelStore();

  const deps = reactive({
    target: '',
  });

  const state = reactive({
    deleting: false,
    deleteId: '',
  });

  const modal = useModal(ModalConfirm, {
    id: 'confirm-delete-resource-model',
    onConfirm: async (callback) => {
      await resourceModel.delete({
        id: state.deleteId,
        projectApiKey,
      });

      callback();

      resourceModel.clear();
      await resourceModel.fetch(projectApiKey);

      if (state.deleteId === resourceModel.target) {
        resourceModel.target = '';
      }

      resourceData.clear(state.deleteId);
      state.deleteId = '';
    },
  });

  const modaltest = useModal(EditResourceModel, {
    id: 'edit-resource-model',
    deps,
    onClose: () => {
      deps.target = '';
    },
    onSuccess: async (id: string) => {
      resourceModel.clear();
      await resourceModel.fetch(projectApiKey);
      resourceData.clear(id);
      await resourceData.fetch({
        projectApiKey,
        resourceModelId: id,
      });
    },
  });

  onMounted(async () => {
    if (resourceModel.list.length === 0) {
      await resourceModel.fetch(projectApiKey);
    }
  });

  onUnmounted(() => {
    resourceModel.target = '';
  });

  watch(refresh, async () => {
    await resourceModel.fetch(projectApiKey);
  });

  const dispatch = (action: string, data: ResourceModel) => {
    switch (action) {
      case 'delete':
        state.deleteId = data.id;
        modal.open();

        break;
      case 'edit':
        deps.target = data.id;
        modaltest.open();

        break;
      case 'open':
        if (resourceModel.target !== data.id) {
          if (!(data.id in resourceData.list)) {
            resourceData.clear(resourceModel.target);
          }

          resourceModel.target = data.id;
        }

        break;
      default:
        break;
    }
  };
</script>

<template>
  <div class="flex mt-4">
    <div class="border card h-96 pr-6 w-1/4">
      <div class="card-body">
        <article
          v-for="model in resourceModel.list"
          :key="model.id"
          class="flex flex-row w-full"
        >
          <ResourceButton
            :is-active="resourceModel.target === model.id"
            @click="dispatch('open', model)"
          >
            {{ model.name }}
          </ResourceButton>
          <div class="dropdown grow-0 w-10">
            <Button color="ghost" tabindex="0" class="m-1 w-full" size="sm">
              <ChevronRightIcon class="h-4 w-4" />
            </Button>
            <DropdownMenu tabindex="0">
              <Option size="xs" @click="dispatch('edit', model)">Edit</Option>
              <Option size="xs" @click="dispatch('delete', model)">
                Delete
              </Option>
            </DropdownMenu>
          </div>
        </article>
      </div>
    </div>
    <div class="pl-6 h-72 w-3/4">
      <ResourceDataTable />
    </div>
    <ClientOnly>
      <component
        :is="modal.component"
        content="Are you sure you want to delete this resource model?"
      />
      <component :is="modaltest.component" />
    </ClientOnly>
  </div>
</template>
