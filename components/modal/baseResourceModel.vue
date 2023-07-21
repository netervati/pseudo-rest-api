<script lang="ts" setup>
  import { Structure } from '~~/types/forms';
  import useResourceDataType from '~~/stores/useResourceDataType';

  type Props = {
    disabled: boolean;
    structure: Structure;
    title: string;
    withDefaults?: boolean;
  };

  const props = withDefaults(defineProps<Props>(), {
    withDefaults: false,
  });

  const emit = defineEmits<{
    (e: 'add'): void;
    (e: 'change', key: string, label: string, value: string): void;
    (e: 'remove', key: string): void;
  }>();

  const resourceDataType = useResourceDataType();

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

  const setValue = (value: string | undefined) => {
    if (props.withDefaults) {
      return value;
    }
  };
</script>

<template>
  <h3 class="text-lg font-bold">Create a new Resource Model</h3>
  <section class="form-control mt-2">
    <FormInput
      :disabled="disabled"
      :rules="{ required: 'Name is required.' }"
      name="name"
      placeholder="Enter name"
    />
  </section>
  <section class="h-60 overflow-y-auto">
    <article v-for="key in Object.keys(structure)" :key="key" class="flex mt-2">
      <section class="basis-4/12 form-control mr-2">
        <FormInput
          :disabled="
            // prettier-ignore
            disabled ||
              structure[key].name === 'id' ||
              structure[key]?.locked === true
          "
          :name="`structure[${key}].name`"
          :rules="{ required: 'Field name is required.' }"
          :value="setValue(structure[key].name)"
          placeholder="Enter the field name"
          @change="(value) => emit('change', key, 'name', value)"
        />
      </section>
      <section class="basis-2/12 form-control ml-2 mr-2">
        <FormSelect
          :disabled="disabled || structure[key]?.locked === true"
          :name="`structure[${key}].type`"
          :rules="{ required: 'Field type is required.' }"
          :options="dataTypes(structure[key].name)"
          :value="setValue(structure[key].type)"
          placeholder="Select the field type"
          @change="(value) => emit('change', key, 'type', value)"
        />
      </section>
      <section class="basis-4/12 form-control ml-2 mr-2">
        <FormInput
          v-if="isDefaultAllowed(structure[key])"
          :disabled="disabled || structure[key]?.locked === true"
          :name="`structure[${key}].default`"
          :rules="{ required: 'Default value is required.' }"
          :value="setValue(structure[key].default)"
          placeholder="Enter the default value"
          @change="(value) => emit('change', key, 'default', value)"
        />
      </section>
      <section class="basis-2/12 flex ml-2">
        <Button
          v-if="structure[key].name !== 'id'"
          :disabled="disabled"
          class="m-auto"
          color="error"
          size="sm"
          @click="emit('remove', key)"
        >
          Remove
        </Button>
      </section>
    </article>
    <article class="mt-2">
      <Button
        :disabled="disabled"
        color="success"
        size="sm"
        @click="emit('add')"
      >
        Add Field
      </Button>
    </article>
  </section>
</template>
