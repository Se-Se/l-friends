<template>
  <div id="app" class="wrapper-sp">
    <router-view name="header"></router-view>
    <router-view />
    <router-view name="footer"></router-view>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import "./assets/css/import.css";
</style>
