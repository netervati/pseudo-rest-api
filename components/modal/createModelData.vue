<script lang="ts" setup>
  // TODO: Implement custom form logic.
  import useModel from '~~/stores/useModel';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success'): void;
  }>();

  defineProps<{
    id: string;
  }>();

  type SchemaRow = { name: string, type: string, immutable: boolean };

  const model = useModel();
  const defaultSchema = model.target?.schema.map((sch: SchemaRow) => sch);
  const form = useForm({
    initialValues: {
      name: '',
      schema: defaultSchema,
    }
  });

  const isDisabled = computed(() => form.isSubmitting.value === true);
  const { fields } = useFieldArray<SchemaRow>('schema');

  const handleClose = () => {
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

  const onSubmit = form.handleSubmit(async (values) => {
  });
</script>

<template>
  <ModalBase :id="id" @close="handleClose">
    <form @submit="onSubmit">
      <h3 class="text-lg font-bold">Generate Model Data</h3>
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
      </div>
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
