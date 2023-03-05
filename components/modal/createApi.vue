<script lang="ts" setup>
  import useApiStore from '~~/stores/useApiStore';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const api = useApiStore();
  const projectApiKey = useProjectApiKey() || '';

  type Form = {
    apiPathError: string;
    apiPath: string;
    description: string;
    validations: {
      apiPath: string;
    };
  };

  const form = useModalForm<Form>(
    {
      apiPathError: '',
      apiPath: '',
      description: '',
      validations: {
        apiPath: 'blank,special_characters',
      },
    },
    {
      onClose: () => emit('close'),
      onProceed: async (body: Omit<Form, 'validations'>) => {
        await api.create(
          {
            description: body.description,
            projectApiKey,
            urlPath: body.apiPath,
          },
          {
            onSuccess: () => {
              emit('success', '');
            },
          }
        );
      },
    }
  );

  const handleChange = () => {
    form.fields.apiPathError = '';
  };
</script>

<template>
  <ModalBase :id="id" @close="form.close">
    <h3 class="text-lg font-bold">Create a new API</h3>
    <section class="form-control mt-2">
      <Input
        v-model="form.fields.apiPath"
        :error="form.fields.apiPathError !== ''"
        placeholder="Enter api path"
        @change="handleChange"
      />
      <p v-if="form.fields.apiPathError !== ''" class="text-red-600">
        {{ form.fields.apiPathError }}
      </p>
    </section>
    <section class="form-control mt-2">
      <Input
        v-model="form.fields.description"
        :disabled="form.controls.loading"
        placeholder="Enter api description"
      />
    </section>
    <ModalFooter
      :deps="form.controls"
      @cancel="form.cancel"
      @proceed="form.proceed"
      @save="form.save"
    />
  </ModalBase>
</template>
