<template>
  <transition name="hamberger">
    <div
      v-if="active"
      class="hamberger__wrapper"
      @click="clickListener"
    >
      <section class="hamberger" ref="hamberger">
        <user-info />

        <div
          class="lately-goods"
          v-if="recentGoods && recentGoods.length > 0"
        >
          <h3 class="lately-goods__title">
            {{ $t('article.recent.title') }}
          </h3>
          <goods-list
            direction="horizontal"
            skin="thumb"
            :goods="recentGoods"
            :padding-left="2"
            :width="7.2"
          />
        </div>

        <navigation
          :update-icon= updateIcon
          @commitClose="closeHamberger"
        />

        <auth-tool />
      </section>
    </div>
  </transition>
</template>

<script>
import * as $ from 'jquery'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import UserInfo from './UserInfo'
import Navigation from './navigation/Navigation'
import AuthTool from './AuthTool'
import GoodsList from '../../goods/GoodsList'
import { mapState } from 'vuex'

const $elem = $('html, body')

export default {
  name: 'Hamberger',
  components: {
    UserInfo,
    Navigation,
    GoodsList,
    AuthTool
  },
  data () {
    return {
      width: window.innerWidth,
      updateIcon: 0
    }
  },
  props: {
    active: Boolean
  },
  computed: {
    ...mapState('recent', ['recentGoods'])
  },
  watch: {
    $route (to, from) {
      this.closeHamberger()
    },
    active (next) {
      this.$nextTick(() => {
        const hambergerElem = this.$refs.hamberger
        if (next) {
          disablePageScroll(hambergerElem)
          $elem.css({ overflow: 'hidden' })
        } else {
          enablePageScroll(hambergerElem)
          $elem.css({ overflow: '' })
        }
      })
    }
  },
  created () {
    window.addEventListener('load', this.handleResize)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    closeHamberger () {
      this.$emit('close')
    },
    clickListener (e) {
      if (e.target.classList.contains('hamberger__wrapper')) {
        this.closeHamberger()
      }
    },
    handleResize () {
      this.width = window.innerWidth
      this.updateIcon = Math.round(this.width / 62.5)
    }
  }
}
</script>

<style lang="scss" scoped>
.hamberger {
  width: 100%;
  height: 100%;
  background: #fff;
  transform: translateX(0);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &__wrapper {
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    background: rgba(17, 17, 17, 0.6);
    width: 100%;
    height: 100%;
    padding-right: 5.6rem;
  }

  &-enter-active, &-leave-active {
    transition: all .3s;

    & .hamberger {
      transition: transform .3s;
    }
  }

  &-enter, &-leave-to {
    background: rgba(17, 17, 17, 0);

    & .hamberger {
      transform: translateX(-100%);
    }
  }

  .lately-goods {
    margin: 0.4rem 0 0;
    padding-bottom: 2.0rem;

    &__title {
      padding-left: 2rem;
      height: 4.8rem;
      line-height: 4.8rem;
      font-family: "Noto Sans KR",sans-self;
      font-weight: 500;
      font-size: 1.6rem;
      color: #333;
    }
  }
}
</style>
