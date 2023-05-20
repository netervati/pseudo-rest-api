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
  const form = useForm({
    initialValues: {
      description: '',
      resourceModelId: '',
      urlPath: '',
    },
  });
  const isDisabled = computed(() => form.isSubmitting.value === true);
  const projectApiKey = useProjectApiKey();

  const handleClose = () => {
    form.resetForm();
    emit('close');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await api.create(
      {
        description: values.description,
        projectApiKey,
        resourceModelId: values.resourceModelId,
        urlPath: values.urlPath,
      },
      {
        onSuccess: () => {
          emit('success', '');
          handleClose();
        },
      }
    );
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
