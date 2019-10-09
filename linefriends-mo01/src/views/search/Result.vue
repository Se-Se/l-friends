<template>
  <div id="container" class="result">
    <search-top @searchList="searchList" />
    <div class="result-wrap">
      <div class="result-product-query-block">
        <search-filter :fetchListParams="fetchListParams" @searchList="searchList" class="result-query-block" />
        <p class="result-query-title">
          <span class="result-query-nums">{{totalCount || 0}}</span> 件の商品があります。
        </p>
        <div class="result-query-product-none" v-if="(!list || totalCount < 1) && !pending.list">
          <div class="result-query-none-img">
            <img src="@/assets/img/common/img_error.png" alt="" class="result-none-image">
          </div>
          <p class="result-query-none-txt">検索結果が見つかりません。</p>
          <div class="result-backto-index-btn">
            <button class="btn btn_green result-btn-style" @click.prevent="goHome">トップページへ戻る</button>
          </div>
        </div>
        <template v-else>
          <div class="result-product-list">
            <ul class="good_list column-2">
              <li v-for="(item, key) in list" :key="`item_${key}`">
                <product-item :item="item" />
              </li>
            </ul>
          </div>
          <mugen-scroll :handler="pageDown" :should-handle="showMugen && !pending.list" :offsetTop="-3000">
            <div id="loader" v-show="showMugen">
              <div class="loader_img"></div>
            </div>
          </mugen-scroll>
        </template>
      </div>
      <best-list v-if="!pending.list && totalCount < 1" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchTop from '@/components/search/SearchTop'
import SearchFilter from '@/components/search/SearchFilter'
import ProductItem from '@/components/common/ProductItem'
import MugenScroll from '@/components/common/MugenScroll'
import BestList from '@/components/common/BestList'

export default {
  components: {
    SearchTop,
    SearchFilter,
    ProductItem,
    MugenScroll,
    BestList
  },
  computed: {
    ...mapState('search', ['list', 'totalCount', 'fetchListParams', 'pending']),
    showMugen () {
      return this.list && this.list.length < this.totalCount
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    pageDown () {
      this.$store.dispatch('search/fetchMore')
    },
    searchList ({ type, keyword, sortType, brandNos }) {
      let query = JSON.parse(JSON.stringify(this.$route.query))
      if (type === 'keyword') {
        query.keyword = keyword
      }
      if (type === 'sort') {
        let sorts = sortType.split('|')
        query.by = sorts[0]
        query.direction = sorts[1]
      }
      if (type === 'brand') {
        delete query.brandName
        if (brandNos) {
          query.brandNos = brandNos
        } else {
          delete query.brandNos
        }
      }
      this.$router.push({
        path: this.$route.path,
        query
      })
    }
  }
}
</script>
