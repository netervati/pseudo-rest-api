<script lang="ts" setup>
  import { useProjectStore, useProjectKeyStore } from '~~/stores';
  import { isRequired } from '~~/utils/formValidations';
  import ModalConfirm from '~~/components/modal/confirm.vue';
  import validateProject from '~~/middleware/validateProject';

  definePageMeta({
    middleware: ['auth'],
  });

  const projectApiKey = useProjectApiKey();
  const projectKey = useProjectKeyStore();
  const project = useProjectStore();

  const form = useForm();
  const isDisabled = computed(() => form.isSubmitting.value === true);

  const secretKey = ref('');

  onMounted(async () => {
    await validateProject();

    form.setValues({
      name: project.target?.name,
      apiKey: projectApiKey,
    });

    const querySecretKey = useRoute().query?.secret_key;

    if (typeof querySecretKey === 'string') {
      secretKey.value = querySecretKey;
    }
  });

  onUnmounted(() => {
    form.resetForm();
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await project.update(
      {
        id: project.target!.id,
        name: values.name,
        projectApiKey,
      },
      {
        onSuccess: () => {
          navigateTo(`/project/${projectApiKey}/settings`);
        },
      }
    );
  });

  const generateSecretKeyModal = useModal(ModalConfirm, {
    id: 'confirm-generate-secret-key',
    onConfirm: async (closeModal: () => void) => {
      await projectKey.regenerate(
        {
          id: project.target!.id,
          projectApiKey,
        },
        {
          onSuccess: (result: { projectApiKey: string; secretKey: string }) => {
            navigateTo({
              path: `/project/${result.projectApiKey}/settings`,
              query: {
                secret_key: result.secretKey,
              },
            });
          },
        }
      );

      closeModal();
    },
  });
</script>

<template>
  <div class="pl-6 pr-6">
    <ProjectSecretKeyBox :secret-key="secretKey" />
    <div class="card border border-gray-300 mt-6">
      <div class="card-body">
        <form @submit="onSubmit">
          <h3 class="font-bold">Edit Project</h3>
          <section class="form-control mt-2">
            <FormInput
              :disabled="isDisabled"
              :rules="{
                required: isRequired('Name is required.'),
              }"
              name="name"
              placeholder="Enter name"
            />
          </section>
          <section class="form-control mt-2">
            <FormInput :disabled="true" name="apiKey" placeholder="" />
          </section>
          <section class="mt-2">
            <Button
              :loading="isDisabled"
              class="float-right"
              color="success"
              size="sm"
              type="submit"
            >
              Save
            </Button>
          </section>
        </form>
      </div>
    </div>
    <div class="card border border-gray-300 mt-6">
      <div class="card-body">
        <Button
          :disabled="isDisabled"
          class="w-100"
          color="error"
          @click="generateSecretKeyModal.open()"
        >
          Generate new Api Key and Secret Key
        </Button>
      </div>
    </div>
    <ClientOnly>
      <component
        :is="generateSecretKeyModal.component"
        content="Are you sure you want to generate a new api key and secret key?"
      />
    </ClientOnly>
  </div>
</template>
