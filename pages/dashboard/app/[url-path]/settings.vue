<script lang="ts" setup>
  import { useApp, useAppKey } from '~~/stores';
  import ModalConfirm from '~~/components/modal/confirm.vue';

  definePageMeta({
    middleware: ['auth', 'validate-app'],
  });

  const apiKey = useAppRefKey();
  const appKey = useAppKey();
  const app = useApp();

  const form = useForm();
  const isMounted = ref(false);
  const isDisabled = computed(() => form.isSubmitting.value === true);

  const secretKey = ref('');

  onMounted(() => {
    isMounted.value = true;

    form.setValues({
      description: app.target?.description,
      title: app.target?.title,
      apiKey,
    });

    const querySecretKey = useRoute().query?.secret_key;

    if (typeof querySecretKey === 'string') {
      secretKey.value = querySecretKey;
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await app.update(
      {
        id: app.target!.id,
        description: values.description,
        title: values.title,
      },
      {
        onSuccess: async () => {
          await app.refresh();

          app.target = app.list.filter(
            (proj) => proj.app_keys[0]?.api_key === apiKey
          )[0];

          form.setValues({
            description: app.target?.description,
            title: app.target?.title,
            apiKey,
          });
        },
      }
    );
  });

  const generateSecretKeyModal = useModal(ModalConfirm, {
    id: 'confirm-generate-secret-key',
    onConfirm: async (closeModal: () => void) => {
      await appKey.regenerate(app.target!.id, {
        onSuccess: (result: { apiKey: string; secretKey: string }) => {
          navigateTo({
            path: `/dashboard/app/${result.apiKey}/settings`,
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
    id: 'confirm-delete-app',
    onConfirm: async (closeModal: () => void) => {
      await app.delete(app.target!.id, {
        onSuccess: async () => {
          await app.refresh();
          closeModal();

          navigateTo('/dashboard');
        },
      });
    },
  });
</script>

<template>
  <div class="pl-6 pr-6">
    <AppSecretKeyBox :secret-key="secretKey" />
    <div class="card border border-gray-300 mt-6">
      <div class="card-body">
        <section v-if="app.isLoading || !isMounted" class="animate-pulse">
          <h3 class="font-bold">Edit App</h3>
          <div class="rounded-lg bg-slate-200 h-12 mt-2 w-full" />
          <div class="rounded-lg bg-slate-200 h-20 mt-2 w-full" />
          <div class="rounded-lg bg-slate-200 h-12 mt-2 w-full" />
          <div class="rounded-lg bg-slate-200 float-right h-8 mt-2 w-16" />
        </section>
        <form v-else @submit="onSubmit">
          <h3 class="font-bold">Edit App</h3>
          <section class="form-control mt-2">
            <FormInput
              :disabled="isDisabled"
              :rules="{
                required: 'Title is required.',
              }"
              name="title"
              placeholder="Enter title"
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
          Generate new API Key and Secret Key
        </Button>
        <Button
          :disabled="isDisabled || isMounted !== true"
          class="mt-2 w-100"
          color="error"
          @click="deleteModal.open()"
        >
          Delete this App
        </Button>
      </div>
    </div>
    <ClientOnly>
      <component
        :is="generateSecretKeyModal.component"
        content="Are you sure you want to generate a new API key and secret key?"
      />
      <component
        :is="deleteModal.component"
        content="Are you sure you want to delete this app?"
      />
    </ClientOnly>
  </div>
</template>
