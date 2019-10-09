<template>
  <div
    class="fixed-wrap"
    :class="{ '_absolute': absolute }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BottomAbsolute',
  props: {
    absolute: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-wrap {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
}
._absolute {
  position: absolute;
}
</style>
