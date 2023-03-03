<script lang="ts" setup>
  import { Api } from '~~/types/models';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const projectApiKey = useProjectApiKey();
  const SPECIAL_CHARACTERS = '`~!@#$%^&*()_+={}[];"\'\\|<,>.?'
    .split('')
    .concat(['//', '--', '/-', '-/']);

  const form = reactive({
    description: '',
    loading: false,
    urlPathError: '',
    urlPath: '',
    showConfirm: false,
  });

  const toast = useToast();

  const validateForm = () => {
    let withError = false;

    if (form.urlPath.trim() === '') {
      form.urlPathError = 'API path cannot be blank.';
      withError = true;
    }

    SPECIAL_CHARACTERS.forEach((char) => {
      if (form.urlPath.includes(char)) {
        form.urlPathError = 'API path is invalid.';
        withError = true;
      }
    });

    return withError;
  };

  const unsetForm = () => {
    emit('close');

    form.description = '';
    form.loading = false;
    form.urlPathError = '';
    form.urlPath = '';
    form.showConfirm = false;
  };

  const handleCancel = () => {
    form.showConfirm = false;
  };

  const handleChange = () => {
    form.urlPathError = '';
  };

  const handleProceed = async () => {
    form.loading = true;

    const { data, error } = await useFetch<Api>('/apis', {
      method: 'post',
      body: {
        description: form.description.trim(),
        projectApiKey,
        urlPath: form.urlPath.trim(),
      },
    });

    form.loading = false;

    if (error.value) {
      toast.error(error.value.statusMessage ?? 'Failed to create api.');
    } else {
      toast.success('Created an api endpoint!');
    }

    if (data.value) {
      emit('success', '');
    }

    unsetForm();
  };

  const handleClose = () => {
    unsetForm();
  };

  const handleSave = () => {
    const errors = validateForm();

    if (!errors) {
      form.showConfirm = true;
    }
  };
</script>

<template>
  <ModalBase :id="id" @close="handleClose">
    <h3 class="text-lg font-bold">Create a new API</h3>
    <section class="form-control mt-2">
      <Input
        v-model="form.urlPath"
        :error="form.urlPathError !== ''"
        placeholder="Enter api path"
        @change="handleChange"
      />
      <p v-if="form.urlPathError !== ''" class="text-red-600">
        {{ form.urlPathError }}
      </p>
    </section>
    <section class="form-control mt-2">
      <Input
        v-model="form.description"
        :disabled="form.loading"
        placeholder="Enter api description"
      />
    </section>
    <ModalFooter
      :deps="{ showConfirm: form.showConfirm, loading: form.loading }"
      @cancel="handleCancel"
      @proceed="handleProceed"
      @save="handleSave"
    />
  </ModalBase>
</template>
