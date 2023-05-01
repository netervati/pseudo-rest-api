<script lang="ts" setup>
  import { FormValidator, runValidations } from '~~/utils/formValidations';

  const emit = defineEmits<{
    (e: 'change', value: string): void;
  }>();

  const props = defineProps<{
    disabled: boolean;
    name: string;
    placeholder: string;
    rules?: { [key: string]: FormValidator };
    value?: string;
  }>();

  const validate = !props.rules ? () => true : runValidations(props.rules);
  const { value } = useField(props.name, validate);

  watchEffect(() => {
    if (props.value) {
      value.value = props.value;
    }
  });
</script>

<template>
  <TextArea
    v-model="value"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    class="textarea textarea-bordered"
    @change="emit('change', value)"
  />
</template>
