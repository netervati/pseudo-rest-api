<script lang="ts" setup>
  import useProjectStore from '~~/stores/useProjectStore';
  import { isRequired } from '~~/utils/formValidations';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const form = useForm();
  const project = useProjectStore();
  const isDisabled = computed(() => form.isSubmitting.value === true);

  const handleClose = () => {
    form.resetForm();
    emit('close');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await project.create(values, {
      onSuccess: (key: string) => {
        emit('success', key);
        handleClose();
      },
    });
  });
</script>

<template>
  <ModalBase :id="id" @close="handleClose">
    <form @submit="onSubmit">
      <h3 class="text-lg font-bold">Create a new Project</h3>
      <section class="form-control mt-2">
        <FormInput
          :disabled="isDisabled"
          name="name"
          placeholder="Enter name"
          :rule="isRequired('Name is required.')"
        />
      </section>
      <section class="form-control mt-2">
        <FormTextArea
          :disabled="isDisabled"
          name="description"
          placeholder="Enter description"
        />
      </section>
      <section class="mt-10">
        <Button :disabled="isDisabled" size="sm" @click="handleClose">
          Cancel
        </Button>
        <Button
          :disabled="isDisabled"
          class="float-right"
          color="success"
          size="sm"
          type="submit"
        >
          Proceed
        </Button>
      </section>
    </form>
  </ModalBase>
</template>
