<script lang="ts" setup>
  import { UnwrapNestedRefs } from 'nuxt/dist/app/compat/capi';
  import useResourceDataTypeStore from '~~/stores/useResourceDataTypeStore';
  import useResourceModelStore from '~~/stores/useResourceModelStore';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'success', key: string): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const resourceDataType = useResourceDataTypeStore();
  const resourceModel = useResourceModelStore();

  onMounted(async () => {
    if (resourceDataType.list.length === 0) {
      await resourceDataType.fetch();
    }
  });

  const projectApiKey = useProjectApiKey() || '';

  type Structure = {
    id: number;
    defaultError: string;
    default: string;
    nameError: string;
    name: string;
    typeError: string;
    type: string;
  };

  type Form = {
    nameError: string;
    name: string;
    structure: Structure[];
    validations: {
      name: 'blank';
      structure: {
        array: {
          default: string;
          name: string;
          type: string;
        };
      };
    };
  };

  const form = useModalForm<Form>(
    {
      nameError: '',
      name: '',
      structure: [
        {
          id: Date.now(),
          defaultError: '',
          default: '',
          nameError: '',
          name: 'id',
          typeError: '',
          type: '',
        },
      ],
      validations: {
        name: 'blank',
        structure: {
          array: {
            default: 'data_type_blank',
            name: 'blank',
            type: 'dropdown',
          },
        },
      },
    },
    {
      onClose: () => emit('close'),
      onProceed: async (body: UnwrapNestedRefs<Omit<Form, 'validations'>>) => {
        const cleanStructure = body.structure.map((structure) => ({
          default: structure.default,
          id: structure.id,
          name: structure.name,
          type: structure.type,
        }));

        await resourceModel.create(
          { name: body.name.trim(), projectApiKey, structure: cleanStructure },
          {
            onSuccess: () => {
              emit('success', '');
            },
          }
        );
      },
    }
  );

  const dataTypes = (name: string) => {
    if (name === 'id') {
      return resourceDataType.list.filter(
        (type) =>
          type.value === 'data_type_number' || type.value === 'data_type_uuid'
      );
    }

    return resourceDataType.list;
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
    form.fields.structure.push({
      defaultError: '',
      default: '',
      id: Date.now(),
      nameError: '',
      name: '',
      typeError: '',
      type: '',
    });
  };

  const removeField = (id: number) => {
    form.fields.structure = form.fields.structure.filter(
      (structure: Structure) => structure.id !== id
    );
  };

  const handleNameChange = () => {
    form.fields.nameError = '';
  };

  type Payload = {
    action: string;
    structure: Structure;
  };

  const handleStructureChange = (payload: Payload) => {
    switch (payload.action) {
      case 'default':
        payload.structure.defaultError = '';
        break;
      case 'name':
        payload.structure.nameError = '';
        break;
      case 'type':
        payload.structure.typeError = '';
        payload.structure.defaultError = '';

        break;
      default:
        break;
    }
  };
</script>

<template>
  <ModalBase :id="id" size="lg" @close="form.close">
    <h3 class="text-lg font-bold">Create a new Resource Model</h3>
    <section class="form-control mt-2">
      <Input
        v-model="form.fields.name"
        :error="form.fields.nameError !== ''"
        placeholder="Enter resource model name"
        @change="handleNameChange"
      />
      <p v-if="form.fields.nameError !== ''" class="text-red-600">
        {{ form.fields.nameError }}
      </p>
    </section>
    <section class="h-60 overflow-y">
      <article
        v-for="structure in form.fields.structure"
        :key="structure.id"
        class="flex mt-2"
      >
        <section class="basis-4/12 form-control mr-2">
          <Input
            v-model="structure.name"
            placeholder="Enter the field name"
            :disabled="structure.name === 'id'"
            :error="structure.nameError !== ''"
            @change="handleStructureChange({ action: 'name', structure })"
          />
          <p v-if="structure.nameError !== ''" class="text-red-600">
            {{ structure.nameError }}
          </p>
        </section>
        <section class="basis-2/12 form-control ml-2 mr-2">
          <Select
            v-model="structure.type"
            :error="structure.typeError !== ''"
            @change="handleStructureChange({ action: 'type', structure })"
          >
            <option disabled value="">Select Type</option>
            <option
              v-for="type in dataTypes(structure.name)"
              :key="type.value"
              :value="type.value"
            >
              {{ type.text }}
            </option>
          </Select>
          <p v-if="structure.typeError !== ''" class="text-red-600">
            {{ structure.typeError }}
          </p>
        </section>
        <section class="basis-4/12 form-control ml-2 mr-2">
          <Input
            v-if="isDefaultAllowed(structure)"
            v-model="structure.default"
            placeholder="Enter the default value"
            :error="structure.defaultError !== ''"
            @change="handleStructureChange({ action: 'default', structure })"
          />
          <p v-if="structure.defaultError !== ''" class="text-red-600">
            {{ structure.defaultError }}
          </p>
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
      :deps="form.controls"
      @cancel="form.cancel"
      @proceed="form.proceed"
      @save="form.save"
    />
  </ModalBase>
</template>
