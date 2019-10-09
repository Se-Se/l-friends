<template>
  <div id="wrap" :class="['wrap', isMobile ? 'mobile' : 'pc']" v-scroll="scrollHandler">
    <link rel="stylesheet" href="/static/styles/mobile.reset.css" v-if="isMobile">
    <router-view name="header"></router-view>
    <router-view :style="minHeight > 0 ? `min-height: calc(100vh - ${minHeight}px)` : '0px'"></router-view>
    <router-view name="footer"></router-view>

    <alert
      ref="Alert"
      @init="callPreLoadAlert"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { isPC } from '@/utils/utils'
import { directive } from '@/directives'
import { EventBus, offScrollNextPage, openPopup } from '@/utils/event-bus'
import cookies from 'js-cookie'
import AOS from 'aos'
import 'aos/dist/aos.css'

// get Global Bus components
const directory = './components/' + (isPC() ? 'pc' : 'mobile')
const Alert = () => import(`${directory}/Alert.vue`)

directive()

export default {
  name: 'app',
  data () {
    return {
      minHeight: 0,
      alert: null
    }
  },
  components: {
    Alert
  },
  computed: {
    isMobile () {
      return !isPC()
    }
  },
  watch: {
    $route (to, from) {
      if (to.name !== from.name) {
        offScrollNextPage()
      }
    }
  },
  methods: {
    scrollHandler () {
      const footer = document.querySelector('footer')
      if (footer) {
        const footerTop = footer.offsetTop
        const contentHeight = window.innerHeight

        const scrollBottom = window.scrollY + window.innerHeight

        if (footerTop > 0 ? (window.scrollY + contentHeight / 1.5) >= footerTop : scrollBottom >= contentHeight) {
          EventBus.$emit('scroll.nextPage')
        }
      }
    },
    changeMinHeight () {
      if (!isPC()) return -1
      let headerHeight = 0
      let footerHeight = 0
      let header = document.getElementsByClassName('header')
      if (header && header.length > 0) {
        headerHeight = document.getElementsByClassName('header')[0].clientHeight
      }
      let footer = document.getElementsByClassName('footer')
      if (footer && footer.length > 0) {
        footerHeight = document.getElementsByClassName('footer')[0].clientHeight
      }
      this.minHeight = headerHeight + footerHeight - 120
    },
    callPreLoadAlert () {
      if (this.alert !== null) {
        EventBus.$emit(this.alert[0], this.alert[1])
        this.alert = null
      }
    }
  },
  updated () {
    this.changeMinHeight()
  },
  mounted () {
    AOS.init()
    window.onresize = () => {
      return (() => {
        this.changeMinHeight()
      })()
    }

    EventBus.$on('alert', params => {
      if (!this.$refs.Alert) {
        this.alert = ['alert', params]
      }
    })

    EventBus.$on('confirm', params => {
      if (!this.$refs.Alert) {
        this.alert = ['confirm', params]
      }
    })
  }
}
</script>

<style lang="scss">
@import './styles/index';
// @import './styles/old_contents';
</style>
