<script lang="ts" setup>
  import { UnwrapNestedRefs } from 'nuxt/dist/app/compat/capi';
  import useResourceDataStore from '~~/stores/useResourceDataStore';
  import useResourceModel from '~~/stores/useResourceModel';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  const props = defineProps<{
    id: string;
    deps: UnwrapNestedRefs<{
      target: string;
    }>;
  }>();

  type Structure = {
    [key: string]: {
      name: string;
      type: string;
      default?: string;
      locked?: boolean;
    };
  };

  const resourceData = useResourceDataStore();
  const resourceModel = useResourceModel();

  type EditResourceModelForm = {
    name: string;
    structure: Structure;
  };

  const form = useForm<EditResourceModelForm>({
    initialValues: {
      name: '',
      structure: {},
    },
  });
  const isDisabled = computed(() => form.isSubmitting.value === true);
  const formStructure = ref<Structure>({});

  watch(props.deps, (deps) => {
    if (deps.target !== '') {
      const target = resourceModel.list.filter(
        (element) => element.id === props.deps.target
      );

      for (const element of target[0]?.structure) {
        formStructure.value[element.id] = {
          locked: true,
          name: element.name,
          default: `${element.default}`,
          type: element.type,
        };
      }

      form.setValues({
        name: target[0].name,
        structure: formStructure.value,
      });
    }
  });

  const handleClose = () => {
    formStructure.value = {};
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
      locked: values.structure[key].locked,
    }));

    await resourceModel.update(
      {
        id: props.deps.target,
        name: values.name,
        structure: cleanStructure,
      },
      {
        onSuccess: async () => {
          resourceData.clear(props.deps.target);
          await resourceData.fetch(props.deps.target);

          handleClose();
        },
      }
    );
  });

  // ------------------------
  // MODEL CONTROLS
  // ------------------------

  const addField = () => {
    formStructure.value[String(Date.now())] = {
      name: '',
      type: '',
      default: '',
      locked: false,
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
  <ModalBase :id="id" size="lg" @close="handleClose()">
    <form @submit="onSubmit">
      <ModalBaseResourceModel
        :disabled="isDisabled"
        :structure="formStructure"
        :with-defaults="true"
        title="Edit Resource Model"
        @add="addField()"
        @change="handleChange"
        @remove="removeField"
      />
      <ModalFooter :disabled="isDisabled" @close="handleClose()" />
    </form>
  </ModalBase>
</template>
