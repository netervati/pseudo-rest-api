<script lang="ts" setup>
  import cloneDeep from 'lodash/cloneDeep';
  import merge from 'lodash/merge';
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

  const createField = ({ id = true } = {}) => {
    const fieldId = String(Date.now());

    const field = {
      [fieldId]: {
        default: '',
        locked: false,
        name: '',
        type: '',
      },
    };

    if (id) {
      field[fieldId].locked = true;
      field[fieldId].name = 'id';
      field[fieldId].type = 'data_type_uuid';
    }

    return field;
  };

  const form = useForm<CreateResourceModelForm>({
    initialValues: {
      structure: createField(),
    },
  });
  const isDisabled = computed(() => form.isSubmitting.value === true);

  const handleClose = () => {
    form.resetForm();
    form.setFieldValue('structure', createField());

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
    const updated = merge(form.values.structure, createField({ id: false }));

    form.setFieldValue('structure', updated);
  };

  const handleChange = (target: string, key: string, value: string) => {
    const updated = cloneDeep(form.values.structure);
    // @ts-ignore
    updated[target][key] = value;
    form.setFieldValue('structure', updated);
  };

  const removeField = (target: string) => {
    const updated = cloneDeep(form.values.structure);

    delete updated[target];

    form.setFieldValue('structure', updated);
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
