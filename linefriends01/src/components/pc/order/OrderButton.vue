<template>
  <button
    :class="['order-button', type, size]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'OrderButton',
  props: {
    type: {
      type: String
    },
    size: {
      type: String,
      default: 'normal'
    }
  }
}
</script>
