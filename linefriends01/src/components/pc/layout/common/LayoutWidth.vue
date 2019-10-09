<template>
  <div v-bind:class="{'layout-width': true, 'layout-width__active': relative === true}">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'layout-width',
  props: {
    relative: {
      type: Boolean,
      required: false
    }
  }
}
</script>
