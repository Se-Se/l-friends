<template>
  <div class="goods-search-form">
    <select
      v-model="order"
      @change="search"
    >
      <option value="MD_RECOMMEND|ASC">
        신상품순
      </option>
      <option value="POPULAR|DESC">
        인기상품순
      </option>
      <option value="DISCOUNTED_PRICE|ASC">
        낮은가격순
      </option>
      <option value="DISCOUNTED_PRICE|DESC">
        높은가격순
      </option>
    </select>
    <router-link
      to="/goods/brand"
      class="select"
    >
      {{ currentBrand.label }}
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GoodsSearchForm',
  data () {
    return {
      order: 'MD_RECOMMEND|ASC'
    }
  },
  watch: {
    $route (next) {
      if (next.query.sortBy) {
        this.order = next.query.sortBy.replace(':', '|')
      } else {
        this.order = 'MD_RECOMMEND|ASC'
      }
    }
  },
  computed: {
    ...mapGetters('brand', ['flatBrands']),
    currentBrand () {
      const brandNo = this.$route.query.brandNo || undefined
      if (!brandNo) {
        return { label: '캐릭터 전체' }
      } else {
        return this.flatBrands.filter(brand => brand.brandNo === brandNo)[0]
      }
    }
  },
  methods: {
    search () {
      this.$emit('search', { order: this.order, character: this.character })
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-search-form {
  display: flex;
  justify-content: space-between;

  select, .select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    position: relative;
    width: 16.4rem;
    height: 4rem;
    padding-left: 1.2rem;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 4rem;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    background-image: url(~@/assets/images/common/ic-arrow.svg);
    background-size: 1.2rem 0.8rem;
    background-position: 13.8rem 1.5rem;
    background-repeat: no-repeat;
  }
}
</style>
