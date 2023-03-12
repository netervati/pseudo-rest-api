<script lang="ts" setup>
  import { ChevronRightIcon } from '@heroicons/vue/24/outline';
  import ModalConfirm from '~~/components/modal/confirm.vue';
  import useResourceModelStore from '~~/stores/useResourceModelStore';
  import { ResourceModel } from '~~/types/models';

  const props = defineProps<{
    refresh: number;
  }>();

  const { refresh } = toRefs(props);
  const projectApiKey = useProjectApiKey() || '';
  const resourceModel = useResourceModelStore();

  const state = reactive({
    deleting: false,
    deleteId: '',
    openId: '',
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

      if (state.deleteId === state.openId) {
        state.openId = '';
      }

      state.deleteId = '';
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

  const dispatch = (action: string, data: ResourceModel | any) => {
    switch (action) {
      case 'delete':
        state.deleteId = data.id;
        modal.open();

        break;
      case 'open':
        state.openId = data.id;

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
            :is-active="state.openId === model.id"
            @click="dispatch('open', model)"
          >
            {{ model.name }}
          </ResourceButton>
          <div class="dropdown grow-0 w-10">
            <Button color="ghost" tabindex="0" class="m-1 w-full" size="sm">
              <ChevronRightIcon class="h-4 w-4" />
            </Button>
            <DropdownMenu tabindex="0">
              <Option size="xs" @click="dispatch('delete', model)">
                Delete
              </Option>
            </DropdownMenu>
          </div>
        </article>
      </div>
    </div>
    <div class="pl-6 w-3/4">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>
                <Button v-if="state.openId !== ''" color="success" size="xs">
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
      </div>
    </div>
    <ClientOnly>
      <modal.component>
        Are you sure you want to delete the resource model?
      </modal.component>
    </ClientOnly>
  </div>
</template>
