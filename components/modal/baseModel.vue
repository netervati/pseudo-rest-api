<script lang="ts" setup>
  import { type FieldEntry } from 'vee-validate';

  type SchemaRow = { name: string, type: string, immutable: boolean };

  defineProps<{
    fields: FieldEntry<SchemaRow>[];
    isDisabled: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'remove', idx: number): void;
  }>();

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
</script>

<template>
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
        v-show="sch.value.name !== 'id'"
        :disabled="isDisabled"
        class="mt-2"
        color="error"
        size="sm"
        @click="emit('remove', idx)"
      >
        X
      </Button>
    </section>
  </div>
</template>
