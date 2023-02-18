<script lang="ts" setup>
  import ModalCreateProject from '~~/components/modal/createProject.vue';

  definePageMeta({
    middleware: 'auth',
  });

  const secretKey = ref('');

  const modal = useModal(ModalCreateProject, {
    onSuccess: (key: string) => {
      secretKey.value = key;
    },
  });
</script>

<template>
  <div class="p-6">
    <Button color="success" size="sm" @click="modal.open">New Project</Button>
    <article v-if="secretKey" class="bg-emerald-400 p-8 rounded-lg mt-4">
      <p>
        Below is your project's secret key. Make sure to copy this as you will
        only see this once!
      </p>
      <div class="mt-2">
        <input class="bg-emerald-300 input w-full" :value="secretKey" />
      </div>
    </article>
  </div>
</template>
