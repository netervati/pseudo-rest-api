<script lang="ts" setup>
  import useApi from '~~/stores/useApi';

  const emit = defineEmits<{ (e: 'close'): void }>();
  defineProps<{ id: string }>();

  const api = useApi();
  const form = useForm({
    initialValues: {
      description: '',
      resourceModelId: '',
      urlPath: '',
    },
  });

  const isDisabled = computed(() => form.isSubmitting.value === true);

  const handleClose = () => {
    form.resetForm();
    emit('close');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await api.create(values, {
      onSuccess: () => {
        handleClose();
      },
    });
  });
</script>

<template>
  <ModalBase :id="id" @close="handleClose">
    <form @submit="onSubmit">
      <ModalBaseApi :disabled="isDisabled" title="Create a new API" />
      <ModalFooter :disabled="isDisabled" @close="handleClose()" />
    </form>
  </ModalBase>
</template>
