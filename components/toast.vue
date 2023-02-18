<script lang="ts" setup>
  type Props = {
    color?: '' | 'error' | 'info' | 'success' | 'warning';
    positionY?: 'top' | 'bottom';
    positionX?: 'left' | 'right';
  };

  type ClassLibrary = { [key: string]: string | undefined };

  const COLORS: ClassLibrary = {
    error: 'alert-error',
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
  };

  const POSITIONS_Y: ClassLibrary = {
    bottom: 'toast-bottom',
    top: 'toast-top',
  };

  const POSITIONS_X: ClassLibrary = {
    right: 'toast-end',
    left: 'toast-start',
  };

  const props = withDefaults(defineProps<Props>(), {
    color: 'info',
    positionY: 'top',
    positionX: 'right',
  });

  const alertMergedClass = computed(() => {
    const alertColor = COLORS[props.color] ?? '';

    return {
      [alertColor]: alertColor !== '',
    };
  });

  const toastMergedClass = computed(() => {
    const toastPositionY = POSITIONS_Y[props.positionY] ?? '';
    const toastPositionX = POSITIONS_X[props.positionX] ?? '';

    return {
      [toastPositionY]: toastPositionY !== '',
      [toastPositionX]: toastPositionX !== '',
    };
  });
</script>

<template>
  <Teleport to="#toast-container">
    <div class="toast" :class="toastMergedClass">
      <div class="alert" :class="alertMergedClass">
        <div>
          <span>
            <slot />
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
