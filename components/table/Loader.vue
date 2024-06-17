<script setup lang="ts">
  defineProps<{
    colspan: number;
  }>();
</script>

<template>
  <tr>
    <td rowspan="4" :colspan="colspan">
      <figure class="flex mt-32 w-full">
        <LoaderSpinner />
      </figure>
    </td>
  </tr>
</template>
