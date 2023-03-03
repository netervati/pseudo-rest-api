<script lang="ts" setup>
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const resourceModel = useResourceModelStore();

  onMounted(async () => {
    if (resourceModel.types.length === 0) {
      await resourceModel.fetchTypes();
    }
  });

  const projectApiKey = useProjectApiKey() || '';

  const form = reactive({
    loading: false,
    nameError: false,
    name: '',
    showConfirm: false,
    structure: [{ default: '', id: Date.now(), name: 'id', type: '' }],
  });

  const dataTypes = (name: string) => {
    if (name === 'id') {
      return resourceModel.types.filter(
        (type) =>
          type.value === 'data_type_number' || type.value === 'data_type_uuid'
      );
    }

    return resourceModel.types;
  };

  const isDefaultAllowed = (structure: { name: string; type: string }) => {
    return (
      structure.name !== 'id' &&
      !structure.type.includes('faker') &&
      !structure.type.includes('uuid')
    );
  };

  // ------------------------
  // MODEL CONTROLS
  // ------------------------

  const addField = () => {
    form.structure.push({ default: '', id: Date.now(), name: '', type: '' });
  };

  const removeField = (id: number) => {
    form.structure = form.structure.filter((structure) => structure.id !== id);
  };

  // ------------------------
  // FORM CONTROLS
  // ------------------------

  const handleCancel = () => {
    form.showConfirm = false;
  };

  const handleChange = () => {
    form.nameError = false;
  };

  const handleClose = () => {
    unsetForm();
  };

  const handleProceed = async () => {
    form.loading = true;

    await resourceModel.create(
      { name: form.name.trim(), projectApiKey, structure: form.structure },
      {
        onSuccess: () => {
          emit('success', '');
        },
      }
    );

    form.loading = false;

    unsetForm();
  };

  const handleSave = () => {
    const errors = validateForm();

    if (!errors) {
      form.showConfirm = true;
    }
  };

  const validateForm = () => {
    if (form.name.trim() === '') {
      form.nameError = true;

      return true;
    }

    return false;
  };

  const unsetForm = () => {
    emit('close');

    form.loading = false;
    form.nameError = false;
    form.name = '';
    form.showConfirm = false;
    form.structure = [{ default: '', id: Date.now(), name: 'id', type: '' }];
  };
</script>

<template>
  <ModalBase :id="id" size="lg" @close="handleClose">
    <h3 class="text-lg font-bold">Create a new Resource Model</h3>
    <section class="form-control mt-2">
      <Input
        v-model="form.name"
        :error="form.nameError"
        placeholder="Enter resource model name"
        @change="handleChange"
      />
      <p v-if="form.nameError" class="text-red-600">Name cannot be blank.</p>
    </section>
    <section class="h-60 overflow-y">
      <article
        v-for="structure in form.structure"
        :key="structure.id"
        class="flex mt-2"
      >
        <section class="basis-4/12 form-control mr-2">
          <Input
            v-model="structure.name"
            placeholder="Enter the field name"
            :disabled="structure.name === 'id'"
          />
        </section>
        <section class="basis-2/12 form-control ml-2 mr-2">
          <select
            v-model="structure.type"
            class="select select-bordered w-full max-w-xs"
          >
            <option disabled value="">Select Type</option>
            <option
              v-for="type in dataTypes(structure.name)"
              :key="type.value"
              :value="type.value"
            >
              {{ type.text }}
            </option>
          </select>
        </section>
        <section class="basis-4/12 form-control ml-2 mr-2">
          <Input
            v-if="isDefaultAllowed(structure)"
            v-model="structure.default"
            placeholder="Enter the default value"
          />
        </section>
        <section class="basis-2/12 flex ml-2">
          <Button
            v-if="structure.name !== 'id'"
            class="m-auto"
            color="error"
            size="sm"
            @click="removeField(structure.id)"
          >
            Remove
          </Button>
        </section>
      </article>
      <article class="mt-2">
        <Button color="success" size="sm" @click="addField">Add Field</Button>
      </article>
    </section>
    <ModalFooter
      :deps="{ showConfirm: form.showConfirm, loading: form.loading }"
      @cancel="handleCancel"
      @proceed="handleProceed"
      @save="handleSave"
    />
  </ModalBase>
</template>
