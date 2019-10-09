<template>
  <header class="header">
    <logo />
  </header>
</template>

<script>
import Logo from '../../../common/Logo'

export default {
  name: 'Header',
  components: {
    Logo
  }
}
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 6.4rem;
    padding: 0 1.5rem;
    background: #fff;

    &-hamberger {
      display: block;
      width: 3.2rem;
      height: 3.2rem;
      margin-right: 4.2rem;
      font-size: 0;
      background-image: url('~@/assets/images/mobile/menu.svg');
      background-size: 100% 100%;
    }
  }
</style>
