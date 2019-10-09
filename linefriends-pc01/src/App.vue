<template>
  <div id="app" class="wrapper-pc">
    <router-view name="header"></router-view>
    <router-view />
    <router-view name="footer"></router-view>
  </div>
</template>
<script>
import '../node_modules/slick-carousel/slick/slick.css'
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import "./assets/css/import.css";
</style>
<style>
.overflow_hidden {
  position: fixed;
  left: 0;
  width: 100%;
  overflow-y: scroll;
}
</style>
