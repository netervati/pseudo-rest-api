<script lang="ts" setup>
  import useResourceData from '~~/stores/useResourceData';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success'): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const form = useForm({
    initialValues: {
      count: '0',
    },
  });
  const isDisabled = computed(() => form.isSubmitting.value === true);
  const maxCountAllowed = ref(10);

  const resourceData = useResourceData();

  watch(resourceData.list, () => {
    const currentCount = resourceData.list.length || 0;

    maxCountAllowed.value = 10 - currentCount;
  });

  const handleClose = () => {
    form.resetForm({
      values: {
        count: '0',
      },
    });
    emit('close');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await resourceData.create(Number(values.count), {
      onSuccess: () => {
        emit('success');
        handleClose();
      },
    });
  });
</script>

<template>
  <ModalBase :id="id" @close="handleClose()">
    <form @submit="onSubmit">
      <h3 class="text-lg font-bold">Generate Resource Data</h3>
      <section class="form-control mt-2">
        <FormRange
          :disabled="isDisabled"
          :rules="{ min: 'Number should be greater than 0.' }"
          :value="form.values.count || '0'"
          :max="maxCountAllowed"
          :min="0"
          name="count"
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
