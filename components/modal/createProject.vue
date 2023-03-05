<script lang="ts" setup>
  import { UnwrapNestedRefs } from 'nuxt/dist/app/compat/capi';
  import useProjectStore from '~~/stores/useProjectStore';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const project = useProjectStore();

  type Form = {
    description: string;
    nameError: string;
    name: string;
    validations: {
      name: string;
    };
  };

  const form = useModalForm<Form>(
    {
      description: '',
      nameError: '',
      name: '',
      validations: {
        name: 'blank',
      },
    },
    {
      onClose: () => emit('close'),
      onProceed: async (body: UnwrapNestedRefs<Omit<Form, 'validations'>>) => {
        await project.create(
          {
            description: body.description,
            name: body.name,
          },
          {
            onSuccess: (key: string) => {
              emit('success', key);
            },
          }
        );
      },
    }
  );

  const handleChange = () => {
    form.fields.nameError = '';
  };
</script>

<template>
  <ModalBase :id="id" @close="form.close">
    <h3 class="text-lg font-bold">Create a new Project</h3>
    <section class="form-control mt-2">
      <Input
        v-model="form.fields.name"
        :error="form.fields.nameError !== ''"
        placeholder="Enter project name"
        @change="handleChange"
      />
      <p v-if="form.fields.nameError !== ''" class="text-red-600">
        {{ form.fields.nameError }}
      </p>
    </section>
    <section class="form-control mt-2">
      <textarea
        v-model="form.fields.description"
        class="textarea textarea-bordered"
        placeholder="Enter project description"
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
