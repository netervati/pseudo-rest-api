<script lang="ts" setup>
  // TODO: Implement custom form logic.
  import { useModelDataType, useModel, useModelData } from '~/stores';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success'): void;
  }>();

  defineProps<{
    id: string;
  }>();

  type SchemaRow = { name: string, type: string, immutable: boolean };

  const model = useModel();
  const modelData = useModelData();
  const modelDataType = useModelDataType();
  const maxCountAllowed = ref(10 - modelData.list.length || 0);

  const defaultSchema = model.target?.schema?.map((sch) => ({
    max: undefined,
    min: undefined,
    name: sch.name,
    type: sch.type,
    option: '',
    immutable: sch.name === 'id'
  })) ?? [];

  const form = useForm({
    initialValues: {
      increase: 0,
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
    await modelData.create(
      {
        increase: values.increase,
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
  <ModalBase :id="id" @close="handleClose" size="lg">
    <form @submit="onSubmit">
      <h3 class="text-lg font-bold">Insert Model Data</h3>
      <div class="flex">
        <section class="form-control mt-2 w-full">
          <label class="mb-2 text-lg">No. of data:</label>
          <FormRange
            :disabled="isDisabled"
            :max="maxCountAllowed"
            :min="1"
            :rules="{ min: 'Number should be greater than 0.' }"
            name="increase"
          />
        </section>
      </div>
      <div class="flex gap-x-2" v-for="(sch, idx) in fields" :key="idx">
        <section class="form-control mt-2">
          <FormInput
            :disabled="true"
            :name="`schema[${idx}].name`"
            placeholder="Enter name"
          />
        </section>
        <section class="form-control mt-2">
          <FormSelect
            :disabled="true"
            :name="`schema[${idx}].type`"
            :options="dropdownOptions"
            placeholder="Select the data type"
          />
        </section>
        <!-- =========== NUMBER -->
        <!-- ================== -->
        <section
          v-show="sch.value.type === 'number'"
          class="form-control mt-2"
        >
          <FormInput
            :disabled="isDisabled"
            :name="`schema[${idx}].min`"
            placeholder="Enter min value"
            type="number"
          />
        </section>
        <section
          v-show="sch.value.type === 'number'"
          class="form-control mt-2"
        >
          <FormInput
            :disabled="isDisabled"
            :name="`schema[${idx}].max`"
            placeholder="Enter max value"
            type="number"
          />
        </section>
        <!-- ================== -->
        <!-- =========== STRING -->
        <!-- ================== -->
        <section
          v-show="sch.value.type === 'string'"
          class="form-control mt-2"
        >
          <FormSelect
            :disabled="isDisabled"
            :name="`schema[${idx}].option`"
            :options="modelDataType.list"
            placeholder="Select the data option"
          />
        </section>
        <!-- ================== -->
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
