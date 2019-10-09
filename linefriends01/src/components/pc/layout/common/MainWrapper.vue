<template>
  <div
    :class="{
      'main-wrapper':true,
      'main-wrapper__main': main === true,
    }">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'main-wrapper',
  props: {
    main: {
      type: Boolean,
      required: false
    },
    nodata: {
      type: Boolean,
      required: false
    }
  }
}
</script>
<style lang="scss" scoped>
.main-wrapper {
  max-width: 1920px;
  margin: 0 auto;
  padding-top: 160px;
  &__main {
    padding-top: 0;
  }
}
</style>
