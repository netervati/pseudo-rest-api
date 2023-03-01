<script lang="ts" setup>
  import { ProjectKey } from '~~/types/models';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

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
</script>

<template>
  <ModalBase :id="id" @close="handleClose">
    <h3 class="text-lg font-bold">Create a new Project</h3>
    <section class="form-control mt-2">
      <Input
        v-model="form.name"
        :error="form.nameError"
        placeholder="Enter project name"
        @change="handleChange"
      />
      <p v-if="form.nameError" class="text-red-600">Name cannot be blank.</p>
    </section>
    <section class="form-control mt-2">
      <textarea
        v-model="form.description"
        class="textarea textarea-bordered"
        placeholder="Enter project description"
      />
    </section>
    <section class="mt-10">
      <Button
        v-if="!form.showConfirm"
        class="float-right"
        color="success"
        size="sm"
        @click="handleSave"
      >
        Save
      </Button>
      <Button
        v-if="form.showConfirm"
        :disabled="form.loading"
        size="sm"
        @click="handleCancel"
      >
        Cancel
      </Button>
      <Button
        v-if="form.showConfirm"
        :loading="form.loading"
        class="float-right"
        color="success"
        size="sm"
        @click="handleProceed"
      >
        Proceed
      </Button>
    </section>
  </ModalBase>
</template>
