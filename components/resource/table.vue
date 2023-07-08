<script lang="ts" setup>
  import EditResourceModel from '../modal/editResourceModel.vue';
  import ModalConfirm from '../modal/confirm.vue';
  import { useResourceDataStore, useResourceModelStore } from '~~/stores';
  import { ResourceModel } from '~~/types/models';

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
    onConfirm: async (closeModal) => {
      await resourceModel.delete(state.deleteId);

      closeModal();

      resourceModel.clear();
      await resourceModel.fetch({ mutateCache: true });

      if (state.deleteId === resourceModel.target) {
        resourceModel.target = '';
      }

      resourceData.clear(state.deleteId);
      state.deleteId = '';
    },
  });

  const editResourceModelModal = useModal(EditResourceModel, {
    id: 'edit-resource-model',
    deps,
    onClose: () => {
      deps.target = '';
    },
  });


  onUnmounted(() => {
    resourceModel.target = '';
  });

  const dispatch = (action: string, data: ResourceModel) => {
    switch (action) {
      case 'delete':
        state.deleteId = data.id;
        modal.open();

        break;
      case 'edit':
        deps.target = data.id;
        editResourceModelModal.open();

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
  <div class="flex mb-6">
    <section class="mr-1">
      <slot />
    </section>
    <section class="flex flex-rows ml-1">
      <article
        v-if="resourceModel.isLoading"
        class="animate-pulse flex flex-row space-x-2 w-full"
      >
        <div class="rounded-lg bg-slate-200 h-8 w-full" />
        <div class="rounded-lg bg-slate-200 h-8 w-10" />
      </article>
      <template v-else>
        <div
          v-for="model in resourceModel.list"
          :key="model.id"
          class="dropdown grow-0 ml-1 mr-1"
        >
          <Button
            :is-active="resourceModel.target === model.id"
            color="ghost"
            tabindex="0"
            size="sm"
          >
            {{ model.name }}
          </Button>
          <DropdownMenu tabindex="0">
            <Option size="xs" @click="dispatch('open', model)">View</Option>
            <Option size="xs" @click="dispatch('edit', model)">Edit</Option>
            <Option size="xs" @click="dispatch('delete', model)">
              Delete
            </Option>
          </DropdownMenu>
        </div>
      </template>
    </section>
  </div>
  <ResourceDataTable />
  <ClientOnly>
    <component
      :is="modal.component"
      content="Are you sure you want to delete this resource model?"
    />
    <component :is="editResourceModelModal.component" />
  </ClientOnly>
</template>
