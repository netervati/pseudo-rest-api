<script lang="ts" setup>
  import { isRequired, isURLPath } from '~~/utils/formValidations';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  defineProps<{
    disabled: boolean;
    title: string;
  }>();

  const resourceModel = useResourceModelStore();
  const dropdownOptions = computed(() =>
    resourceModel.list.map((model) => ({
      text: model.name,
      value: model.id,
    }))
  );
</script>

<template>
  <h3 class="text-lg font-bold">{{ title }}</h3>
  <section class="form-control mt-2">
    <FormInput
      :disabled="disabled"
      :rules="{
        required: isRequired('URL Path is required.'),
        urlPath: isURLPath('URL Path is not valid'),
      }"
      name="urlPath"
      placeholder="Enter url path"
    />
  </section>
  <section class="form-control mt-2">
    <FormSelect
      :disabled="disabled"
      :rules="{ required: isRequired('Resource model is required.') }"
      :options="dropdownOptions"
      name="resourceModelId"
      placeholder="Select the resource model"
    />
  </section>
  <section class="form-control mt-2">
    <FormTextArea
      :disabled="disabled"
      name="description"
      placeholder="Enter description"
    />
  </section>
</template>
