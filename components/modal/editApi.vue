<script lang="ts" setup>
  import { UnwrapNestedRefs } from 'nuxt/dist/app/compat/capi';
  import useApiStore from '~~/stores/useApiStore';
  import { isRequired, isURLPath } from '~~/utils/formValidations';
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
  const projectApiKey = useProjectApiKey() || '';

  watch(props.deps, (deps) => {
    if (deps.target !== '') {
      const target = api.list.filter(
        (element: Api) => element.id === props.deps.target
      );

      form.setValues({
        description: target[0].description,
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
      <h3 class="text-lg font-bold">Edit API</h3>
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
