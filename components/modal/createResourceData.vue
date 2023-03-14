<script lang="ts" setup>
  import { UnwrapNestedRefs } from 'nuxt/dist/app/compat/capi';
  import { useResourceDataStore, useResourceModelStore } from '~~/stores';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success'): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const projectApiKey = useProjectApiKey() || '';
  const resourceData = useResourceDataStore();
  const resourceModel = useResourceModelStore();

  type Form = {
    count: string;
    validations: {
      [key: string]: string;
    };
  };

  const form = useModalForm<Form>(
    {
      count: '0',
      validations: {},
    },
    {
      onClose: () => emit('close'),
      onProceed: async (body: UnwrapNestedRefs<Omit<Form, 'validations'>>) => {
        await resourceData.create(
          {
            count: Number(body.count),
            projectApiKey,
            resourceModelId: resourceModel.target,
          },
          {
            onSuccess: () => {
              emit('success');
            },
          }
        );
      },
    }
  );
</script>

<template>
  <ModalBase :id="id" @close="form.close">
    <h3 class="text-lg font-bold">Generate Resource Data</h3>
    <section class="form-control mt-2">
      <input
        v-model="form.fields.count"
        type="range"
        min="0"
        max="10"
        class="range range-xs"
      />
    </section>
    <section class="grid grid-cols-2">
      <div>{{ form.fields.count }}</div>
      <div class="text-end">10</div>
    </section>
    <ModalFooter
      :deps="form.controls"
      @cancel="form.cancel"
      @proceed="form.proceed"
      @save="form.save"
    />
  </ModalBase>
</template>
