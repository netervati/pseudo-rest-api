<script setup lang="ts">
  import { Cog6ToothIcon } from '@heroicons/vue/24/outline';
  import { Model } from '~~/types/models';
  import useModel from '~~/stores/useModel';
  import ModalCreateModelData from '~~/components/modal/createModelData.vue';

  const model = useModel();

  const highlightTab = (id: string) => {
    return {
      'border-b-2': true,
      'tab-active border-b-slate-600': id === model.target?.id,
      'border-b-slate-300': id !== model.target?.id
    };
  }

  const handleSelectModel = (md: Model) => {
    model.setTarget(md);
  };

  const createModelDataModal = useModal(ModalCreateModelData, { id: 'create-model-data' });
</script>

<template>
  <section class="flex gap-x-2 w-full">
    <slot />
    <Dropdown
      :disabled="!model.target"
      avatar
      class="rounded-lg"
      color="ghost"
      size="sm"
    >
      <template #label>
        <Cog6ToothIcon class="h-4 w-4" />
      </template>
      <template #options>
        <DropdownOption @click="createModelDataModal.open()">
          Generate
        </DropdownOption>
        <DropdownOption>Edit</DropdownOption>
        <DropdownOption>Delete</DropdownOption>
      </template>
    </Dropdown>
    <article
      v-if="model.isLoading"
      class="animate-pulse flex flex-row space-x-2 w-full"
    >
      <div class="rounded-lg bg-slate-200 h-8 w-20" />
      <div class="rounded-lg bg-slate-200 h-8 w-20" />
    </article>
    <div role="tablist" class="tabs">
      <a
        v-for="md in model.list"
        :key="md.id"
        role="tab"
        class="tab text-lg"
        :class="highlightTab(md.id)"
        @click="handleSelectModel(md)"
      >
        {{ md.name }}
      </a>
    </div>
  </section>
  <div class="mt-4">
    <div class="overflow-y-scroll" style="height: 70vh">
      <table class="table w-full">
        <thead>
          <tr>
            <th />
            <th
              v-for="
                // @ts-ignore
                sch in model.target?.schema"
              class="font-normal normal-case text-base"
            >
              {{
                // @ts-ignore
                sch.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <TableLoader v-if="model.isLoading" :colspan="4" />
          <!-- <tr v-for="record in api.list" v-else :key="record.id">
            <td>
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
          </tr> -->
        </tbody>
      </table>
    </div>
    <ClientOnly>
      <component :is="createModelDataModal.component" />
    </ClientOnly>
  </div>
</template>
