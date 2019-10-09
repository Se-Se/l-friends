<template>
  <div v-scroll="scrollHandler">
    <section
      v-if="!$route.meta.hideHeader"
      class="header__wrapper"
    >
      <header
        ref="header"
        :class="{ header: true, show: show, absolute: isGoodsDetail, zindex: isGoodsDetail  }"
      >
        <div class="header-hamberger-wrap">
          <a
            class="header-hamberger"
            @click.prevent="active.hamberger = true"
          >
            {{ $t('layout.menu') }}
          </a>
        </div>
        <logo />
        <ul class="header-tools">
          <li>
            <router-link
              to="/goods/search"
              class="header-tools__item header-tools__search"
            >
              {{ $t('layout.search') }}
            </router-link>
          </li>
          <li>
            <router-link to="/cart">
              <cart-icon class="header-tools__item header-tools__cart" />
            </router-link>
          </li>
        </ul>
      </header>
    </section>
    <hamberger
      :active="active.hamberger"
      @close="active.hamberger = false"
    />
  </div>
</template>

<script>
import Logo from '@/components/common/Logo'
import CartIcon from '@/components/common/icon/CartIcon'
import Hamberger from '@/components/mobile/layout/hamberger/Hamberger'

export default {
  name: 'Header',
  components: {
    CartIcon,
    Hamberger,
    Logo
  },
  data () {
    return {
      active: {
        hamberger: false
      },
      currentScroll: 0,
      lastScroll: 0
    }
  },
  computed: {
    show () {
      const header = this.$refs.header
      return (header ? this.currentScroll <= header.offsetHeight : false) || this.currentScroll <= this.lastScroll
    },
    isGoodsDetail () {
      return this.$route.name === 'GoodsDetail'
    }
  },
  methods: {
    scrollHandler (evt, el) {
      this.lastScroll = this.currentScroll
      this.currentScroll = window.scrollY
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1004;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 6rem;
    padding: 0 1.5rem;
    background: #fff;
    transform: translateY(-100%);
    transition: transform .2s;

    &.show {
      transform: translateY(0);
    }

    &.absolute {
      position: absolute;
      transform: translateY(0);
    }
    
    &.zindex {
      z-index: 0;
    }

    &__wrapper {
      padding-top: 6rem;
    }

    &-hamberger {
      display: block;
      width: 3.2rem;
      height: 3.2rem;
      margin-right: 4.2rem;
      font-size: 0;
      background-image: url('~@/assets/images/mobile/menu.svg');
      background-size: 100% 100%;
    }

    &-tools {
      display: flex;
      justify-content: space-between;
      width: 7.4rem;

      &__item {
        display: block;
        width: 3.2rem;
        height: 3.2rem;
        background-size: 100% 100%;
      }

      &__search {
        background-image: url('~@/assets/images/mobile/search.svg');
        font-size: 0;
      }
    }
  }
</style>
