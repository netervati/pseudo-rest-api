<script lang="ts" setup>
  import { useProject, useProjectKeyStore } from '~~/stores';
  import ModalConfirm from '~~/components/modal/confirm.vue';

  definePageMeta({
    middleware: ['auth', 'validate-project'],
  });

  const projectApiKey = useProjectApiKey();
  const projectKey = useProjectKeyStore();
  const project = useProject();

  const form = useForm();
  const isMounted = ref(false);
  const isDisabled = computed(() => form.isSubmitting.value === true);

  const secretKey = ref('');

  onMounted(() => {
    isMounted.value = true;

    form.setValues({
      description: project.target?.description,
      name: project.target?.name,
      apiKey: projectApiKey,
    });

    const querySecretKey = useRoute().query?.secret_key;

    if (typeof querySecretKey === 'string') {
      secretKey.value = querySecretKey;
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await project.update(
      {
        id: project.target!.id,
        description: values.description,
        name: values.name,
      },
      {
        onSuccess: async () => {
          await project.refresh();

          project.target = project.list.filter(
            (proj) => proj.project_keys[0]?.api_key === projectApiKey
          )[0];

          form.setValues({
            description: project.target?.description,
            name: project.target?.name,
            apiKey: projectApiKey,
          });
        },
      }
    );
  });

  const generateSecretKeyModal = useModal(ModalConfirm, {
    id: 'confirm-generate-secret-key',
    onConfirm: async (closeModal: () => void) => {
      await projectKey.regenerate(project.target!.id, {
        onSuccess: (result: { projectApiKey: string; secretKey: string }) => {
          navigateTo({
            path: `/project/${result.projectApiKey}/settings`,
            query: {
              secret_key: result.secretKey,
            },
          });
        },
      });

      closeModal();
    },
  });

  const deleteModal = useModal(ModalConfirm, {
    id: 'confirm-delete-project',
    onConfirm: async (closeModal: () => void) => {
      await project.delete(project.target!.id, {
        onSuccess: async () => {
          await project.refresh();
          closeModal();

          navigateTo('/');
        },
      });
    },
  });
</script>

<template>
  <div class="pl-6 pr-6">
    <ProjectSecretKeyBox :secret-key="secretKey" />
    <div class="card border border-gray-300 mt-6">
      <div class="card-body">
        <section v-if="project.isLoading || !isMounted" class="animate-pulse">
          <h3 class="font-bold">Edit Project</h3>
          <div class="rounded-lg bg-slate-200 h-12 mt-2 w-full" />
          <div class="rounded-lg bg-slate-200 h-20 mt-2 w-full" />
          <div class="rounded-lg bg-slate-200 h-12 mt-2 w-full" />
          <div class="rounded-lg bg-slate-200 float-right h-8 mt-2 w-16" />
        </section>
        <form v-else @submit="onSubmit">
          <h3 class="font-bold">Edit Project</h3>
          <section class="form-control mt-2">
            <FormInput
              :disabled="isDisabled"
              :rules="{
                required: 'Name is required.',
              }"
              name="name"
              placeholder="Enter name"
            />
          </section>
          <section class="form-control mt-2">
            <FormTextArea
              :disabled="isDisabled"
              name="description"
              placeholder="Enter description"
            />
          </section>
          <section class="form-control mt-2">
            <FormInput :disabled="true" name="apiKey" placeholder="" />
          </section>
          <section class="mt-2">
            <Button
              :loading="isDisabled || isMounted !== true"
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
          :disabled="isDisabled || isMounted !== true"
          class="w-100"
          color="error"
          @click="generateSecretKeyModal.open()"
        >
          Generate new Api Key and Secret Key
        </Button>
        <Button
          :disabled="isDisabled || isMounted !== true"
          class="mt-2 w-100"
          color="error"
          @click="deleteModal.open()"
        >
          Delete this Project
        </Button>
      </div>
    </div>
    <ClientOnly>
      <component
        :is="generateSecretKeyModal.component"
        content="Are you sure you want to generate a new api key and secret key?"
      />
      <component
        :is="deleteModal.component"
        content="Are you sure you want to delete this project?"
      />
    </ClientOnly>
  </div>
</template>
