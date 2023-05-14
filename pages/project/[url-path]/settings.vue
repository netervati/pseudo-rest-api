<script lang="ts" setup>
  import useProjectStore from '~~/stores/useProjectStore';
  import { isRequired } from '~~/utils/formValidations';
  import { ProjectWithProjectKey } from '~~/types/models';

  const projectApiKey = useProjectApiKey();
  const project = useProjectStore();
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
</script>

<template>
  <div class="p-6">
    <div class="card border border-gray-300">
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
  </div>
</template>
