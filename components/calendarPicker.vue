<script setup lang="ts">
  import { CalendarDaysIcon } from '@heroicons/vue/24/solid';
  import { format } from 'date-fns';
  import { DatePicker as VCalendarDatePicker } from 'v-calendar';
  import 'v-calendar/dist/style.css';

  const emit = defineEmits<{
    (e: 'change', value: string): void;
  }>();

  const props =  defineProps<{
    disabled: boolean;
    name: string;
    value?: string;
  }>();

  const { value } = useField(() => props.name);

  const curDate = new Date();

  const range = ref({
    start: curDate,
    end: curDate,
  });

  watch(range, (updated) => {
    value.value = updated;
  });

  onMounted(() => {
    value.value = range.value;
  });

  watchEffect(() => {
    if (props.value) {
      value.value = props.value;
    }
  });
</script>

<template>
  <div tabindex="0" class="collapse bg-base-200">
    <input type="checkbox" /> 
    <div class="flex collapse-title gap-4 text-sm font-medium">
      <CalendarDaysIcon class="w-4 h-4" />
      {{ format(range.start, 'MMMM d, yyy') }} - {{ format(range.end, 'MMMM d, yyy') }}
    </div>
    <div class="collapse-content"> 
      <VCalendarDatePicker v-model.range="range" />
    </div>
  </div>
</template>
