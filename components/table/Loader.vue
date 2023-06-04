<script setup lang="ts">
  defineProps<{
    colspan: number;
  }>();
</script>

<template>
  <tr>
    <td :colspan="colspan">
      <div class="flex h-full w-full">
        <LoaderSpinner />
      </div>
    </td>
  </tr>
</template>
