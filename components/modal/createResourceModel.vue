<script lang="ts" setup>
  import useResourceModel from '~~/stores/useResourceModel';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const resourceModel = useResourceModel();

  type Structure = {
    [key: string]: {
      name: string;
      type: string;
      default?: string;
    };
  };

  type CreateResourceModelForm = {
    name: string;
    structure: Structure;
  };

  const formStructure = ref<Structure>({
    [String(Date.now())]: {
      name: 'id',
      type: '',
      default: '',
    },
  });
  const form = useForm<CreateResourceModelForm>({
    initialValues: {
      structure: {},
    },
  });
  const isDisabled = computed(() => form.isSubmitting.value === true);

  onMounted(() => {
    form.setFieldValue('structure', formStructure.value);
  });

  const handleClose = () => {
    formStructure.value = {
      [String(Date.now())]: {
        name: 'id',
        type: '',
        default: '',
      },
    };
    form.resetForm({
      values: {
        name: '',
        structure: formStructure.value,
      },
    });

    emit('close');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const cleanStructure = Object.keys(values.structure).map((key) => ({
      default: values.structure[key].default || '',
      id: key,
      name: values.structure[key].name,
      type: values.structure[key].type,
    }));

    await resourceModel.create(
      {
        name: values.name,
        structure: cleanStructure,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  });

  // ------------------------
  // STRUCTURE FIELDS CONTROLS
  // ------------------------

  const addField = () => {
    formStructure.value[String(Date.now())] = {
      name: '',
      type: '',
      default: '',
    };

    form.setFieldValue('structure', formStructure.value);
  };

  const handleChange = (target: string, key: string, value: string) => {
    // @ts-ignore
    formStructure.value[target][key] = value;
  };

  const removeField = (target: string) => {
    delete formStructure.value[target];

    form.setFieldValue('structure', formStructure.value);
  };
</script>

<template>
  <ModalBase :id="id" size="lg" @close="handleClose">
    <form @submit="onSubmit">
      <ModalBaseResourceModel
        :disabled="isDisabled"
        :structure="form.values.structure"
        title="Create a new Resource Model"
        @add="addField()"
        @change="handleChange"
        @remove="removeField"
      />
      <ModalFooter :disabled="isDisabled" @close="handleClose()" />
    </form>
  </ModalBase>
</template>
