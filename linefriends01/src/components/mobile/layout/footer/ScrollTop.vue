<template>
  <div v-scroll="scrollHandler">
    <transition name="scroll">
      <button
        v-if="show"
        type="button"
        class="scroll-top"
        @click="scrollToTop"
      >
        {{ $t('layout.scrollTop') }}
      </button>
    </transition>
  </div>
</template>

<script>
import * as $ from 'jquery'

export default {
  name: 'ScrollTop',
  data () {
    return {
      show: false
    }
  },
  methods: {
    scrollToTop () {
      $('html, body').animate({ scrollTop: 0 })
    },
    scrollHandler () {
      this.show = window.scrollY > 0
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll {
  &-top {
    position: fixed;
    z-index: 2;
    right: 2rem;
    bottom: 2rem;
    width: 4rem;
    height: 4rem;
    background-image: url('~@/assets/images/mobile/top.svg');
    background-size: 4rem 4rem;
    font-size: 0;
    opacity: 1;
  }

  &-enter-active, &-leave-active {
    transition: opacity .2s;
  }

  &-enter, &-leave-to {
    opacity: 0;
  }
}
</style>
