<script lang="ts" setup>
  // import { ProjectKey } from '~~/types/models';
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
      onProceed: async (body: Omit<Form, 'validations'>) => {
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
  /**
  const form = reactive({
    description: '',
    loading: false,
    nameError: false,
    name: '',
    showConfirm: false,
  });

  const toast = useToast();

  const validateForm = () => {
    if (form.name.trim() === '') {
      form.nameError = true;

      return true;
    }

    return false;
  };

  const unsetForm = () => {
    emit('close');

    form.description = '';
    form.loading = false;
    form.nameError = false;
    form.name = '';
    form.showConfirm = false;
  };

  const handleCancel = () => {
    form.showConfirm = false;
  };

  const handleChange = () => {
    form.nameError = false;
  };

  const handleProceed = async () => {
    form.loading = true;

    const { data, error } = await useFetch<ProjectKey>('/projects', {
      method: 'post',
      body: {
        name: form.name.trim(),
        description: form.description.trim(),
      },
    });

    form.loading = false;

    if (error.value) {
      toast.error(error.value.statusMessage ?? 'Failed to create project.');
    } else {
      toast.success('Created a project!');
    }

    if (data.value) {
      emit('success', data.value?.secret_key);
    }

    unsetForm();
  };

  const handleClose = () => {
    unsetForm();
  };

  const handleSave = () => {
    const errors = validateForm();

    if (!errors) {
      form.showConfirm = true;
    }
  };
  */
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
