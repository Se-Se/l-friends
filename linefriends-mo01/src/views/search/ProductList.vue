<template>
  <div id="container" class="list">
    <breadcrumb :title="listTitle" />

    <div class="list-wrap">
      <product-tab :categoryRoot="categorieDepth1" :categorySub="categorieDepth2" :banner="categoryBanners" @searchList="searchList" v-if="!saleFLg" />

      <div class="list-wrap-content">
        <div class="list-select-wrap">
          <search-filter :fetchListParams="fetchListParams" @searchList="searchList" class="list-product-select-block" />
        </div>
        <div class="list-select-product-list">
          <p class="list-select-result">
            <span class="list-select-result-nums">{{totalCount || 0}}</span> 件の商品があります。
          </p>
          <div class="list-select-no-data" v-if="(!list || totalCount < 1) && !pending.list">
            <img src="@/assets/img/common/img_error.png" alt="" class="list-select-no-data-img">
            <p class="list-select-no-data-txt">販売中の商品がございません。</p>
          </div>
          <template v-else>
            <ul class="good_list column-2">
              <li v-for="(item, key) in list" :key="`item_${key}`">
                <product-item :item="item" />
              </li>
            </ul>
            <mugen-scroll :handler="pageDown" :should-handle="showMugen && !pending.list" :offsetTop="-3000">
              <div id="loader" v-show="showMugen">
                <div class="loader_img"></div>
              </div>
            </mugen-scroll>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import Breadcrumb from '@/components/common/Breadcrumb'
import ProductTab from '@/components/search/ProductTab'
import SearchFilter from '@/components/search/SearchFilter'
import ProductItem from '@/components/common/ProductItem'
import MugenScroll from '@/components/common/MugenScroll'

export default {
  computed: {
    ...mapState('search', ['list', 'totalCount', 'fetchListParams', 'pending']),
    ...mapGetters('common', ['categorieDepth1', 'categorieDepth2']),
    ...mapGetters('display', ['categoryBanners']),
    saleFLg () {
      return this.$route.query.sale
    },
    listTitle () {
      let titleLabel = 'すべて'
      if (this.saleFLg) {
        titleLabel = 'SALE'
      }
      if (this.categorieDepth1) {
        titleLabel = this.categorieDepth1.label
      }
      return titleLabel
    },
    showMugen () {
      return this.list && this.list.length < this.totalCount
    }
  },
  methods: {
    pageDown () {
      this.$store.dispatch('search/fetchMore')
    },
    searchList ({ type, sortType, brandNos, categoryNo, depth1Desc, subCategoryNo, depth2Desc }) {
      let query = JSON.parse(JSON.stringify(this.$route.query))
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
      if (type === 'category') {
        let path = `/m/goods/${categoryNo}`
        query.depth1Desc = depth1Desc
        if (subCategoryNo && depth2Desc) {
          path += `/${subCategoryNo}`
          query.depth2Desc = depth2Desc
        } else {
          delete query.depth2Desc
        }
        this.$router.push({
          path,
          query
        })
      } else {
        this.$router.push({
          path: this.$route.path,
          query
        })
      }
    }
  },
  components: {
    Breadcrumb,
    ProductTab,
    SearchFilter,
    ProductItem,
    MugenScroll
  }
}
</script>
