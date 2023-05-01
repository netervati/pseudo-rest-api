<script lang="ts" setup>
  import { FormValidator, runValidations } from '~~/utils/formValidations';

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
    class="textarea textarea-bordered"
    :placeholder="props.placeholder"
  />
</template>
