<template>
  <header id="header" :class="{'haveban': topBanners && topBanners.length}" ref="header">
    <div :class="{'header':true, 'fixed': scrolled }">
      <header-banner :topBanners="topBanners" v-if="topBanners && topBanners.length" />
      <header-main />
    </div>
  </header>
</template>
<script>
import HeaderBanner from '@/components/header/HeaderBanner'
import HeaderMain from '@/components/header/HeaderMain'
import { mapGetters } from 'vuex'
import $ from 'jquery'

export default {
  name: 'Header',
  components: {
    HeaderBanner,
    HeaderMain
  },
  data () {
    return {
      scrolled: false,
      lastPosition: 0
    }
  },
  methods: {
    scrollHandler () {
      let st = window.pageYOffset || document.documentElement.scrollTop
      st = parseInt(st, 10)
      if (st > this.lastPosition) {
        this.scrolled = false
      } else {
        this.scrolled = true
      }
      this.lastPosition = st <= 0 ? 0 : st
    }
  },
  computed: {
    ...mapGetters('display', ['topBanners'])
  },
  created () {
    $(window).scroll(this.scrollHandler)
  }
}
</script>
