<script lang="ts" setup>
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
        required: 'URL Path is required.',
        url: 'URL Path is not valid.',
      }"
      name="urlPath"
      placeholder="Enter url path"
    />
    <p class="text-sm pl-2">e.g. users (this is analyzed as <i>"/users"</i>)</p>
  </section>
  <section class="mt-2 mb-4">
    <hr />
  </section>
  <section class="form-control mt-2">
    <FormSelect
      :disabled="disabled"
      :rules="{ required: 'Resource model is required.' }"
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
