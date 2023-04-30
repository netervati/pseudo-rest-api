<script lang="ts" setup>
  const props = defineProps<{
    disabled: boolean;
    name: string;
    placeholder: string;
  }>();

  const { value } = useField(props.name);
</script>

<template>
  <textarea
    v-model="value"
    :disabled="props.disabled"
    class="textarea textarea-bordered"
    placeholder="Enter project description"
  />
</template>
