<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'confirm'): Promise<void>;
    (e: 'close'): void;
  }>();

  defineProps<{
    id: string;
  }>();

  const loading = ref(false);

  const handleConfirm = async () => {
    loading.value = true;
    await emit('confirm');

    loading.value = false;
    emit('close');
  };
</script>

<template>
  <ModalBase :id="id" @close="emit('close')">
    <h3 class="text-lg font-bold">Confirm Action</h3>
    <slot />
    <section class="mt-10">
      <Button :disabled="loading" size="sm" @click="emit('close')">
        Cancel
      </Button>
      <Button
        :loading="loading"
        class="float-right"
        color="success"
        size="sm"
        @click="handleConfirm"
      >
        Proceed
      </Button>
    </section>
  </ModalBase>
</template>
