<script lang="ts" setup>
  import { useProjectStore, useProjectKeyStore } from '~~/stores';
  import { isRequired } from '~~/utils/formValidations';
  import { ProjectWithProjectKey } from '~~/types/models';
  import ModalConfirm from '~~/components/modal/confirm.vue';

  const projectApiKey = useProjectApiKey() || '';
  const project = useProjectStore();
  const projectKey = useProjectKeyStore();
  const currentProject = ref<ProjectWithProjectKey>();

  const form = useForm();
  const isDisabled = computed(() => form.isSubmitting.value === true);

  onMounted(async () => {
    await project.fetch();

    currentProject.value = project.list.filter(
      (element) => element.project_keys[0].api_key === projectApiKey
    )[0];

    form.setValues({
      name: currentProject.value!.name,
      apiKey: projectApiKey,
    });
  });

  onUnmounted(() => {
    form.resetForm();
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await project.update(
      {
        id: currentProject.value!.id,
        name: values.name,
        projectApiKey,
      },
      {
        onSuccess: async () => {
          await project.fetch();
        },
      }
    );
  });

  const secretKey = ref('');

  const generateSecretKeyModal = useModal(ModalConfirm, {
    id: 'confirm-generate-secret-key',
    onConfirm: async (callback: () => void) => {
      await projectKey.regenerate(
        {
          id: currentProject.value!.id,
          projectApiKey,
        },
        {
          onSuccess: (key: string) => {
            secretKey.value = key;
          },
        }
      );

      callback();
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
          class="w-100"
          color="error"
          @click="generateSecretKeyModal.open()"
        >
          Generate new Secret Key
        </Button>
      </div>
    </div>
    <ClientOnly>
      <component
        :is="generateSecretKeyModal.component"
        content="Are you sure you want to generate a new secret key?"
      />
    </ClientOnly>
  </div>
</template>
