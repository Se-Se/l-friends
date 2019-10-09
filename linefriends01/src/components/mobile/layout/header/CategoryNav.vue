<template>
  <nav
    ref="SubPageNav"
    class="sub-page-nav--wrapper"
  >
    <ul class="sub-page-nav">
      <li class="sub-page-nav__item">
        <router-link
          :class="['sub-page-nav__label', isActive() ? 'active' : '']"
          :to="'/goods/' + categorieTabDepth1.categoryNo"
        >{{ $t('menu.all') }}</router-link>
      </li>
      <li
        v-for="(item, index) in categories"
        :key="index"
        class="sub-page-nav__item"
      >
        <router-link
          :class="['sub-page-nav__label', isActive(item.categoryNo) ? 'active' : '']"
          :to="'/goods/' + categorieTabDepth1.categoryNo + '/' + item.categoryNo"
        >{{ item.label }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: 'CategoryNav',
  computed: {
    ...mapGetters('categories', ['categorieTabDepth1']),
    categories () {
      return this.categorieTabDepth1.children
    }
  },
  watch: {
    $route (next) {
      this.$nextTick(() => {
        this.setActivePosition()
      })
    }
  },
  mounted () {
    this.setActivePosition()
  },
  methods: {
    isActive (categoryNo) {
      return this.$router.currentRoute.path === ('/goods/' + this.categorieTabDepth1.categoryNo + (categoryNo ? '/' + categoryNo : ''))
    },
    setActivePosition () {
      const $item = $('.sub-page-nav__label.active', this.$refs.SubPageNav)

      this.$refs.SubPageNav.scrollTo($item[0].offsetLeft - (window.innerWidth - $item.width()) / 2, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-page-nav {
  display: flex;
  height: 5.1rem;
  border-bottom: 1px solid #eee;
  padding: 0 2rem;
  width: max-content;
  min-width: 100%;

  &--wrapper {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    margin-right: 2.4rem;
    margin-bottom: -1px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__label {
    display: block;
    font-size: 1.6rem;
    line-height: 5.1rem;
    color: #999;
    font-weight: 400;

    &.active {
      box-sizing: border-box;
      height: 100%;
      color: #333;
      font-weight: 600;
      border-bottom: 0.2rem solid #333;
    }
  }
}
</style>
