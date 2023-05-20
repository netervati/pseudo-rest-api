<script lang="ts" setup>
  import { UnwrapNestedRefs } from 'nuxt/dist/app/compat/capi';
  import useApiStore from '~~/stores/useApiStore';
  import useResourceModelStore from '~~/stores/useResourceModelStore';
  import { Api } from '~~/types/models';

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

  const api = useApiStore();
  const form = useForm();
  const isDisabled = computed(() => form.isSubmitting.value === true);
  const projectApiKey = useProjectApiKey();
  const resourceModel = useResourceModelStore();
  const dropdownOptions = computed(() =>
    resourceModel.list.map((model) => ({
      text: model.name,
      value: model.id,
    }))
  );

  watch(props.deps, (deps) => {
    if (deps.target !== '') {
      const target = api.list.filter(
        (element: Api) => element.id === props.deps.target
      );

      form.setValues({
        description: target[0].description,
        resourceModelId: dropdownOptions.value.filter(
          (option) => option.value === target[0].resource_model_id
        )[0].value,
        urlPath: target[0].url_path,
      });
    }
  });

  const handleClose = () => {
    form.resetForm();
    emit('close');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await api.update(
      {
        id: props.deps.target,
        description: values.description,
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
      <ModalBaseApi :disabled="isDisabled" title="Edit API" />
      <ModalFooter :disabled="isDisabled" @close="handleClose()" />
    </form>
  </ModalBase>
</template>
