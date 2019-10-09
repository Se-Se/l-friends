<template>
  <div
    class="fixed-wrap"
    :class="{ '_absolute': absolute }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BottomFixed',
  props: {
    absolute: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 2rem;
  width: 100%;
  background-color: #ffffff;
}
._absolute {
  position: absolute;
}
</style>
