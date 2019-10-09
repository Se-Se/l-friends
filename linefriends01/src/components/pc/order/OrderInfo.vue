<template>
  <div class="information">
    <i :class="['information-icon', size]">i</i>
    <p class="information-message"><slot /></p>
  </div>
</template>

<script>
export default {
  name: 'OrderInformation',
  props: {
    size: {
      type: String,
      default: 'normal'
    }
  }
}
</script>
