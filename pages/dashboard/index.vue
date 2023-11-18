<script lang="ts" setup>
  import ModalCreateApp from '~~/components/modal/createApp.vue';
  import useApp from '~~/stores/useApp';

  definePageMeta({
    middleware: 'auth',
  });

  const app = useApp();
  const secretKey = ref('');

  const modal = useModal(ModalCreateApp, {
    id: 'create-app',
    onSuccess: (key: string) => {
      secretKey.value = key;
    },
  });
</script>

<template>
  <div class="p-6">
    <Button
      :disabled="app.isDisabled"
      color="success"
      size="sm"
      @click="modal.open"
    >
      New App
    </Button>
    <AppSecretKeyBox :secret-key="secretKey" />
    <AppGrid />
    <ClientOnly>
      <component :is="modal.component" />
    </ClientOnly>
  </div>
</template>
