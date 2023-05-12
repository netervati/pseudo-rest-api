<script lang="ts" setup>
  import useApiStore from '~~/stores/useApiStore';
  import useResourceModelStore from '~~/stores/useResourceModelStore';
  import { isRequired, isURLPath } from '~~/utils/formValidations';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const api = useApiStore();
  const form = useForm({
    initialValues: {
      description: '',
      method: '',
      resourceModelId: '',
      urlPath: '',
    },
  });
  const isDisabled = computed(() => form.isSubmitting.value === true);
  const projectApiKey = useProjectApiKey() || '';
  const resourceModel = useResourceModelStore();
  const dropdownOptions = computed(() =>
    resourceModel.list.map((model) => ({
      text: model.name,
      value: model.id,
    }))
  );

  const handleClose = () => {
    form.resetForm();
    emit('close');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await api.create(
      {
        description: values.description,
        method: values.method,
        projectApiKey,
        resourceModelId: values.resourceModelId,
        urlPath: values.urlPath,
      },
      {
        onSuccess: () => {
          emit('success', '');
          handleClose();
        },
      }
    );
  });
</script>

<template>
  <ModalBase :id="id" @close="handleClose">
    <form @submit="onSubmit">
      <h3 class="text-lg font-bold">Create a new API</h3>
      <section class="form-control mt-2">
        <FormInput
          :disabled="isDisabled"
          :rules="{
            required: isRequired('URL Path is required.'),
            urlPath: isURLPath('URL Path is not valid'),
          }"
          name="urlPath"
          placeholder="Enter url path"
        />
      </section>
      <article class="flex mt-2">
        <section class="basis-1/2 form-control mr-2">
          <FormSelect
            :disabled="isDisabled"
            :rules="{ required: isRequired('HTTP Method is required.') }"
            :options="[
              {
                text: 'GET',
                value: 'GET',
              },
              {
                text: 'POST',
                value: 'POST',
              },
              {
                text: 'PUT',
                value: 'PUT',
              },
              {
                text: 'DELETE',
                value: 'DELETE',
              },
            ]"
            name="method"
            placeholder="Select the HTTP Method"
          />
        </section>
        <section class="basis-1/2 form-control ml-2">
          <FormSelect
            :disabled="isDisabled"
            :rules="{ required: isRequired('Resource model is required.') }"
            :options="dropdownOptions"
            name="resourceModelId"
            placeholder="Select the resource model"
          />
        </section>
      </article>
      <section class="form-control mt-2">
        <FormTextArea
          :disabled="isDisabled"
          name="description"
          placeholder="Enter description"
        />
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
