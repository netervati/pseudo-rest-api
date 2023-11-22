<script setup lang="ts">
  type Props = {
    class?: string;
    isButton?: boolean;
    to?: string;
  };

  const props = withDefaults(defineProps<Props>(), {
    class: '',
    isButton: true,
    to: '/',
  });

  const mergeClass = () => {
    return {
      'btn btn-ghost': props.isButton,
      [props.class]: props.class !== '',
    }
  }
</script>

<template>
  <NuxtLink
    :to="props.to"
    :class="mergeClass()"
    class="font-bold gap-x-2 normal-case text-xl"
  >
    <img width="36" src="/logo.png" /> PseudoRESTAPI
  </NuxtLink>
</template>
