<template>
  <div class="goods-tab">
    <ul class="goods-tab__list">
      <li
        class="goods-tab__item">
        <router-link
          :to="'/goods/' + categorieTabDepth1.categoryNo"
          :class="['goods-tab__item-action', isActive() ? '_active' : '']"
        >{{ $t('menu.all') }}</router-link>
      </li>
      <li
        v-for="(item, index) in categories"
        :key="index"
        class="goods-tab__item"
      >
        {{ item }}
        <!-- $route.to.query.depth1Desc -->
        <router-link
          :to="'/goods/' + categorieTabDepth1.categoryNo + '/' + item.categoryNo + '?depth1Desc=' + categorieTabDepth1.label + '&depth2Desc=' + item.label"
          :class="['goods-tab__item-action', isActive(item.categoryNo) ? '_active' : '']"
        >{{ item.label }}</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GoodsTabs',
  computed: {
    ...mapGetters('categories', ['categorieTabDepth1']),
    categories () {
      return this.categorieTabDepth1.children
    }
  },
  methods: {
    isActive (categoryNo) {
      return this.$router.currentRoute.path === ('/goods/' + this.categorieTabDepth1.categoryNo + (categoryNo ? '/' + categoryNo : ''))
    }
  }
}
</script>
