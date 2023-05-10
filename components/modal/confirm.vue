<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'confirm', callback: () => void): Promise<void>;
    (e: 'close'): void;
  }>();

  defineProps<{
    id: string;
    content: string;
  }>();

  const loading = ref(false);

  const handleConfirm = async () => {
    loading.value = true;

    await emit('confirm', () => {
      emit('close');
      loading.value = false;
    });
  };
</script>

<template>
  <ModalBase :id="id" @close="emit('close')">
    <h3 class="text-lg font-bold">Confirm Action</h3>
    <p>{{ content }}</p>
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
