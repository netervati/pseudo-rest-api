<script lang="ts" setup>
  import useModel from '~~/stores/useModel';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success'): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const model = useModel();

  type SchemaRow = { name: string, type: string, immutable: boolean };
  const defaultSchema = model.target?.schema
    ? model.target?.schema?.map((sch) => ({
        name: sch.name,
        type: sch.type,
        immutable: true,
      }))
    : [{ name: 'id', type: 'uuid', immutable: true }];

  const form = useForm({
    initialValues: {
      name: model.target?.name ?? '',
      schema: defaultSchema,
    }
  });
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
    await model.update(
      {
        name: values.name,
        schema: values.schema,
      },
      {
        onSuccess: (updated) => {
          if (updated) {
            model.setTarget(updated);
          }

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
      <h3 class="text-lg font-bold">Edit the Model</h3>
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
