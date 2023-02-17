<script lang="ts" setup>
  defineProps<{
    id: string;
  }>();

  const form = reactive({
    name: '',
    nameError: false,
  });

  const showConfirm = ref(false);

  const validateForm = () => {
    if (form.name.trim() === '') {
      form.nameError = true;

      return true;
    }

    return false;
  };

  const handleCancel = () => {
    showConfirm.value = false;
  };

  const handleChange = () => {
    form.nameError = false;
  };

  const handleProceed = () => {
    const projectKey = useFetch('/projects', {
      method: 'post',
      body: {
        name: form.name,
      },
    });

    console.log(projectKey);
  };

  const handleSave = () => {
    const errors = validateForm();

    if (!errors) {
      showConfirm.value = true;
    }
  };
</script>

<template>
  <ModalBase :id="id">
    <h3 class="text-lg font-bold">Create a new Project</h3>
    <section class="form-control mt-2">
      <Input
        v-model="form.name"
        :error="form.nameError"
        placeholder="Enter project name"
        @change="handleChange"
      />
      <p v-if="form.nameError" class="text-red-600">Name cannot be blank.</p>
    </section>
    <section class="mt-10">
      <Button
        v-if="!showConfirm"
        class="float-right"
        color="success"
        size="sm"
        @click="handleSave"
      >
        Save
      </Button>
      <Button v-if="showConfirm" size="sm" @click="handleCancel">Cancel</Button>
      <Button
        v-if="showConfirm"
        class="float-right"
        color="success"
        size="sm"
        @click="handleProceed"
      >
        Proceed
      </Button>
    </section>
  </ModalBase>
</template>
