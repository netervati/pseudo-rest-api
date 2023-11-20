<script setup lang="ts">
  import { Cog6ToothIcon } from '@heroicons/vue/24/outline';
  import { NormalizedModel } from '~~/types/models';
  import useModel from '~~/stores/useModel';
  import ModalConfirm from '~~/components/modal/confirm.vue';

  const model = useModel();

  const highlightTab = (id: string) => {
    return {
      'border-b-2': true,
      'tab-active border-b-slate-600': id === model.target?.id,
      'border-b-slate-300': id !== model.target?.id
    };
  }

  const handleSelectModel = (md: NormalizedModel) => {
    model.setTarget(md);
  };

  const deleteModelModal = useModal(ModalConfirm, {
    id: 'confirm-delete-model',
    onConfirm: async (closeModal) => {
      const deleteId = model.target?.id;

      await model.delete(deleteId);

      closeModal();

      model.unsetTarget();
    },
  });
</script>

<template>
  <section class="flex gap-x-2 w-full">
    <slot />
    <Dropdown
      :disabled="model.isLoading || !model.target"
      avatar
      class="rounded-lg"
      color="ghost"
      size="sm"
    >
      <template #label>
        <Cog6ToothIcon class="h-4 w-4" />
      </template>
      <template #options>
        <DropdownOption>Edit</DropdownOption>
        <DropdownOption @click="deleteModelModal.open()">
          Delete
        </DropdownOption>
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
    <ClientOnly>
      <component
        :is="deleteModelModal.component"
        content="Are you sure you want to delete this model?"
      />
    </ClientOnly>
  </section>
  <div v-if="model.target">
    <ModelTable
      :key="model.target.id"
      :schema="model.target?.schema ?? []"
    />
  </div>
</template>
