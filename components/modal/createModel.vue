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
      schema: [defaultSchema]
    }
  });
  const model = useModel();
  const isDisabled = computed(() => form.isSubmitting.value === true);

  const { remove, push, fields } = useFieldArray<SchemaRow>('schema'); 

  const handleClose = () => {
    // TODO: Make sure form resets the schema size.
    // Refer to community: https://github.com/logaretm/vee-validate/discussions/4548
    form.handleReset();
  
    emit('close');
  };

  const DATA_TYPES = {
    boolean: 'Boolean',
    float: 'Float',
    number: 'Number',
    string: 'String',
    timestamp: 'Timestamp',
    uuid: 'UUID'
  };

  type DataType = keyof typeof DATA_TYPES;
  type Dropdown = { text: string, value: string }[];

  const dropdownOptions = computed(() =>
    Object.keys(DATA_TYPES).reduce<Dropdown>(
      (arr, dataType) => {
        const list = arr;
        list.push(
          {
            text: DATA_TYPES[dataType as DataType],
            value: dataType,
          }
        )

        return list;
      },
      []
    )
  );

  const handleAddSchema = () => {
    push(
      { name: '', type: '', immutable: false }
    );
  };

  // const handleDeleteSchema = (idx: number) => {
  //   schema.value.splice(idx, 1);
  // };

  const onSubmit = form.handleSubmit(async (values) => {
    await model.create(
      {
        name: values.name,
        schema: values.schema,
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
      <section class="form-control mt-2">
        <FormInput
          :disabled="isDisabled"
          :rules="{ required: 'Name is required.' }"
          name="name"
          placeholder="Enter name"
        />
      </section>
      <div class="flex gap-x-2" v-for="(sch, idx) in fields" :key="idx">
        <section class="form-control mt-2">
          <FormInput
            :disabled="isDisabled || sch.value.immutable"
            :rules="{ required: 'Name is required.' }"
            :name="`schema[${idx}].name`"
            placeholder="Enter name"
          />
        </section>
        <section class="form-control mt-2">
          <FormSelect
            :disabled="isDisabled || sch.value.immutable"
            :name="`schema[${idx}].type`"
            :rules="{ required: 'Data type is required.' }"
            :options="dropdownOptions"
            placeholder="Select the data type"
          />
        </section>
        <section class="form-control mt-2">
          <Button
            v-show="!sch.value.immutable"
            :disabled="isDisabled"
            class="mt-2"
            color="error"
            size="sm"
            @click="remove(idx)"
          >
            X
          </Button>
        </section>
      </div>
      <Button
        :disabled="isDisabled"
        class="mt-2"
        color="success"
        size="sm"
        @click="handleAddSchema()"
      >
        Add field
      </Button>
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
