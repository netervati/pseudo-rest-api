<script lang="ts" setup>
  import useApp from '~~/stores/useApp';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const form = useForm();
  const app = useApp();
  const isDisabled = computed(() => form.isSubmitting.value === true);

  const handleClose = () => {
    form.resetForm();
    emit('close');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await app.create(
      {
        description: values.description,
        title: values.title,
      },
      {
        onSuccess: (key: string) => {
          emit('success', key);
          handleClose();
        },
      }
    );
  });
</script>

<template>
  <ModalBase :id="id" @close="handleClose">
    <form @submit="onSubmit">
      <h3 class="text-lg font-bold">Create a new App</h3>
      <section class="form-control mt-2">
        <FormInput
          :disabled="isDisabled"
          :rules="{ required: 'Title is required.' }"
          name="title"
          placeholder="Enter title"
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
          :loading="isDisabled"
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
