<script lang="ts" setup>
  import useModel from '~~/stores/useModel';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success'): void;
  }>();

  defineProps<{
    id: string;
  }>();

  type SchemaRow = { name: string, type: string, immutable: boolean };
  const defaultSchema = { name: 'id', type: 'uuid', immutable: true };

  const form = useForm({
    initialValues: {
      name: '',
      schema: [defaultSchema],
    }
  });
  const model = useModel();
  const isDisabled = computed(() => form.isSubmitting.value === true);

  const { remove, push, fields } = useFieldArray<SchemaRow>('schema'); 

  const handleClose = () => {
    form.resetForm();

    const length = fields.value.length;
    for (let i = 1; i <= length; i++) {
      remove(i);
    }

    emit('close');
  };

  const handleAddSchema = () => {
    push(
      { name: '', type: '', immutable: false }
    );
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const data = values.schema.map((sch) => ({
      name: sch.name,
      type: sch.type,
    }));

    await model.create(
      {
        name: values.name,
        schema: data,
      },
      {
        onSuccess: () => {
          emit('success');
          handleClose();
        },
      }
    );
  });
</script>

<template>
  <ModalBase :id="id" @close="handleClose">
    <form @submit="onSubmit">
      <h3 class="text-lg font-bold">Create a new Model</h3>
      <ModalBaseModel
        :is-disabled="form.isSubmitting.value"
        :fields="fields"
        @remove="remove"
      />
      <Button
        :disabled="isDisabled"
        class="mt-2"
        color="success"
        size="sm"
        @click="handleAddSchema()"
      >
        Add field
      </Button>
      <ModalFooter :disabled="isDisabled" @close="handleClose()" />
    </form>
  </ModalBase>
</template>
