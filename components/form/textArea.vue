<script lang="ts" setup>
  const props = defineProps<{
    disabled: boolean;
    name: string;
    placeholder: string;
    rule?: (value: string) => boolean | string;
  }>();

  const validate = props.rule || (() => true);
  const { value } = useField(props.name, validate);
</script>

<template>
  <TextArea
    v-model="value"
    :disabled="props.disabled"
    class="textarea textarea-bordered"
    :placeholder="props.placeholder"
  />
</template>
