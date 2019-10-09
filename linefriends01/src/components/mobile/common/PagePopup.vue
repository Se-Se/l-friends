<template>
  <transition name="page-popup">
    <div v-show="show" class="page-popup__wrapper">
      <slot />
    </div>
  </transition>
</template>

<script>
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { mapMutations } from 'vuex'
import * as $ from 'jquery'

const $elem = $('html, body')

export default {
  name: 'PagePopup',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      $scrollElem: null
    }
  },
  watch: {
    show (next) {
      if (this.$scrollElem) {
        if (next) {
          disablePageScroll(this.$scrollElem[0])
          $elem.css('overflow', 'hidden')
        } else {
          enablePageScroll(this.$scrollElem[0])
          $elem.css('overflow', '')
        }
      }
    }
  },
  mounted () {
    this.addPopup(this)
    this.$scrollElem = $('> *', this.$el).addClass('page-popup')
  },
  methods: {
    ...mapMutations('pagePopup', ['addPopup'])
  }
}
</script>

<style lang="scss" scoped>
.page-popup {
  &__wrapper {
    position: fixed;
    z-index: 1005;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  &-enter-active,
  &-leave-active {
    transition: 0.3s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(5rem);
  }
}

/deep/ .page-popup {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
