<script lang="ts" setup>
  import { UnwrapNestedRefs } from 'nuxt/dist/app/compat/capi';
  import useResourceDataTypeStore from '~~/stores/useResourceDataTypeStore';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

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

  const resourceDataType = useResourceDataTypeStore();
  const resourceModel = useResourceModelStore();

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

  onMounted(async () => {
    if (resourceDataType.list.length === 0) {
      await resourceDataType.fetch();
    }
  });

  const projectApiKey = useProjectApiKey() || '';

  const dataTypes = (name: string) => {
    if (name === 'id') {
      return resourceDataType.list.filter(
        (type) =>
          type.value === 'data_type_number' || type.value === 'data_type_uuid'
      );
    }

    return resourceDataType.list;
  };

  const isDefaultAllowed = (structure: { name: string; type: string }) => {
    return (
      structure.name !== 'id' &&
      !structure.type.includes('faker') &&
      !structure.type.includes('uuid')
    );
  };

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
        projectApiKey,
        structure: cleanStructure,
      },
      {
        onSuccess: () => {
          emit('success', props.deps.target);
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
      <h3 class="text-lg font-bold">Edit Resource Model</h3>
      <section class="form-control mt-2">
        <FormInput
          :disabled="isDisabled"
          :rules="{ required: isRequired('Name is required.') }"
          name="name"
          placeholder="Enter name"
        />
      </section>
      <section class="h-60 overflow-y-auto">
        <article
          v-for="key in Object.keys(formStructure)"
          :key="key"
          class="flex mt-2"
        >
          <section class="basis-4/12 form-control mr-2">
            <FormInput
              :disabled="
                // prettier-ignore
                isDisabled ||
                  formStructure[key].name === 'id' ||
                  formStructure[key].locked === true
              "
              :rules="{ required: isRequired('Field name is required.') }"
              :name="`structure[${key}].name`"
              :value="formStructure[key].name"
              placeholder="Enter the field name"
              @change="(value) => handleChange(key, 'name', value)"
            />
          </section>
          <section class="basis-2/12 form-control ml-2 mr-2">
            <FormSelect
              :disabled="isDisabled || formStructure[key].locked === true"
              :rules="{ required: isRequired('Field type is required.') }"
              :name="`structure[${key}].type`"
              :options="dataTypes(formStructure[key].name)"
              :value="formStructure[key].type"
              placeholder="Select the field type"
              @change="(value) => handleChange(key, 'type', value)"
            />
          </section>
          <section class="basis-4/12 form-control ml-2 mr-2">
            <FormInput
              v-if="isDefaultAllowed(formStructure[key])"
              :disabled="isDisabled || formStructure[key].locked === true"
              :rules="{ required: isRequired('Default value is required.') }"
              :name="`structure[${key}].default`"
              :value="formStructure[key].default"
              placeholder="Enter the default value"
              @change="(value) => handleChange(key, 'default', value)"
            />
          </section>
          <section class="basis-2/12 flex ml-2">
            <Button
              v-if="formStructure[key].name !== 'id'"
              :disabled="isDisabled"
              class="m-auto"
              color="error"
              size="sm"
              @click="removeField(key)"
            >
              Remove
            </Button>
          </section>
        </article>
        <article class="mt-2">
          <Button color="success" size="sm" @click="addField()">
            Add Field
          </Button>
        </article>
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
