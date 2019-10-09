<template>
  <div>
    <header id="header" :class="{'haveban': topBanners && topBanners[0]}">
      <div :class="{'header':true, 'fixed': scrolled}">
        <header-banner :topBanners="topBanners && topBanners[0]" />
        <header-top />
        <header-main :characterm="charactersmenu" :allm="allmenu" :subm="submenu" />
      </div>
    </header>
  </div>
</template>

<script>
import HeaderBanner from '@/components/header/HeaderBanner'
import HeaderTop from '@/components/header/HeaderTop'
import HeaderMain from '@/components/header/HeaderMain'
import { mapGetters } from 'vuex'
export default {
  name: 'Header',
  components: {
    HeaderBanner,
    HeaderTop,
    HeaderMain
  },
  data () {
    return {
      scrolled: false,
      charactersmenu: true,
      submenu: true,
      allmenu: true,
      lastPosition: 0
    }
  },
  created () {
    window.addEventListener('scroll', this.scrollHandler)
  },
  methods: {
    scrollHandler () {
      let st = window.pageYOffset || document.documentElement.scrollTop
      if (st > this.lastPosition) {
        this.charactersmenu = false
        this.allmenu = false
        this.submenu = false
        this.scrolled = false
      }

      if (this.lastPosition > st) {
        this.charactersmenu = true
        this.allmenu = true
        this.submenu = true
        this.scrolled = true
      }
      this.lastPosition = st <= 0 ? 0 : st
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  computed: {
    ...mapGetters('display', ['topBanners'])
  }
}
</script>

<style>
</style>
