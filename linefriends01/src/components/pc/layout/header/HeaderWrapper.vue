<template>
  <header>
    <div class="header__wrapper">
      <slot></slot>
    </div>
  </header>
</template>
<script>
export default {
  name: 'header-wrapper',
  data () {
    return {
      scroll: false
    }
  }
}
</script>
<style lang="scss" scoped>
  .header {
    position: fixed;
    width: 100%;
    height: auto;
    z-index: 1000;
    background-color: #fff;
    transform: translateY(-100%);
    transition: transform .2s;
  }
  .show {
    transform: translateY(0);
  }
</style>
