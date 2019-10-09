<template>
  <div class="layout-full">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'layout-full'
}
</script>
<style lang="scss" scoped>
.layout-full {
  width: 100%;
  min-width: 1180px;
  height: auto;
  background-color: #f6f6f6;
}
</style>
