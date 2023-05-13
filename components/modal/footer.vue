<script setup lang="ts">
  defineProps<{
    disabled: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();
</script>

<template>
  <section class="mt-10">
    <Button :disabled="disabled" size="sm" @click="emit('close')">
      Cancel
    </Button>
    <Button
      :loading="disabled"
      class="float-right"
      color="success"
      size="sm"
      type="submit"
    >
      Proceed
    </Button>
  </section>
</template>
