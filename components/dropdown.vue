<script setup lang="ts">
  interface Props {
    avatar?: boolean;
    class?: string;
    color?: 'dark' | 'error' | 'ghost' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    error?: boolean;
    placeholder?: string;
    position?: 'end';
    size?: 'xs' | 'sm' | 'lg' | 'xl' | '';
  }

  const props = withDefaults(defineProps<Props>(), {
    avatar: false,
    class: '',
    color: 'dark',
    disabled: false,
    error: false,
    placeholder: '',
    position: undefined,
    size: '',
  });

  const baseClass = computed(() => ({
    'dropdown-end': props.position === 'end',
  }));

  type ClassLibrary = { [key: string]: string | undefined };

  const COLORS: ClassLibrary = {
    dark: 'btn-dark',
    error: 'btn-error',
    ghost: 'btn-ghost',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
  };

  const SIZES: ClassLibrary = {
    md: 'btn-md',
    lg: 'btn-lg',
    sm: 'btn-sm',
    xs: 'btn-xs',
  };

  const labelClass = computed(() => {
    const btnColor = COLORS[props.color] ?? '';
    const btnSize = SIZES[props.size] ?? '';

    return {
      [btnColor]: btnColor !== '',
      [btnSize]: btnSize !== '',
      [props.class]: props.class !== '',
      avatar: props.avatar,
    };
  });
</script>

<template>
  <div :class="baseClass" class="dropdown">
    <label
      :class="labelClass"
      :disabled="disabled || undefined"
      class="border-gray-300 btn"
      tabindex="0"
    >
      <slot name="label" />
    </label>
    <ul
      tabindex="0"
      class="bg-base-100 dropdown-content menu menu-compact mt-3 p-2 rounded-box shadow w-52"
    >
      <slot name="options" />
    </ul>
  </div>
</template>
