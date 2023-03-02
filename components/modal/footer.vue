<script lang="ts" setup>
  type ModalForm = {
    showConfirm: boolean;
    loading: boolean;
  };

  const emit = defineEmits(['cancel', 'proceed', 'save']);

  defineProps<{
    deps: ModalForm;
  }>();
</script>

<template>
  <section class="mt-10">
    <Button
      v-if="!deps.showConfirm"
      class="float-right"
      color="success"
      size="sm"
      @click="emit('save')"
    >
      Save
    </Button>
    <Button
      v-if="deps.showConfirm"
      :disabled="deps.loading"
      size="sm"
      @click="emit('cancel')"
    >
      Cancel
    </Button>
    <Button
      v-if="deps.showConfirm"
      :loading="deps.loading"
      class="float-right"
      color="success"
      size="sm"
      @click="emit('proceed')"
    >
      Proceed
    </Button>
  </section>
</template>
