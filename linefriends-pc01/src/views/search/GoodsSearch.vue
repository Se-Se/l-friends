<template>
  <div id="container" class="list">
    <div class="wrap">
      <bread-crumbs :breadCrumbs="categorieDepth1 && categorieDepth1.label" />

      <h1 class="list-title">{{listTitle}}</h1>

      <list-top :categoryRoot="categorieDepth1" :categorySub="categorieDepth2" :banner="categoryBanners" @searchList="searchList" v-if="!saleFLg" />

      <list-filter :pageSize="pageSize" :totalCount="totalCount || 0" :fetchListParams="fetchListParams" @searchList="searchList" />

      <template v-if="list && totalCount">
        <product-list :list="list" />
        <pagination v-model="pageIdx" :total="totalCount" :limit="pageSize" type="list" @goPage="pageChange" />
      </template>
      <div class="list-product-block" v-else-if="!pending.list">
        <div class="list-product-none-char">
          <div class="list-product-none-img">
            <img src="@/assets/img/common/img_error.png" alt="">
          </div>
          <p class="list-product-none-txt">販売中の商品がございません</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import BreadCrumbs from '@/components/common/BreadCrumbs'
import ListTop from '@/components/search/ListTop'
import ListFilter from '@/components/search/ListFilter'
import ProductList from '@/components/search/ProductList'
import Pagination from '@/components/common/Pagination'

export default {
  components: {
    BreadCrumbs,
    ListTop,
    ListFilter,
    ProductList,
    Pagination
  },
  computed: {
    ...mapState('search', ['list', 'totalCount', 'fetchListParams', 'pending']),
    ...mapGetters('display', ['categoryBanners']),
    ...mapGetters('common', ['categorieDepth1', 'categorieDepth2']),
    pageIdx () {
      return this.fetchListParams && this.fetchListParams.pageNumber ? this.fetchListParams.pageNumber : 1
    },
    pageSize () {
      return this.fetchListParams && this.fetchListParams.pageSize ? this.fetchListParams.pageSize : 40
    },
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
    }
  },
  methods: {
    pageChange (pageNo) {
      this.searchList({ type: 'pageIdx', pageNo })
    },
    searchList ({ type, pageNo, pageSize, sortType, brandNos, categoryNo, depth1Desc, subCategoryNo, depth2Desc }) {
      let query = JSON.parse(JSON.stringify(this.$route.query))
      if (type === 'pageIdx') {
        query.pageNumber = pageNo
      }
      if (type === 'pageSize') {
        query.pageSize = pageSize
        query.pageNumber = 1
      }
      if (type === 'sort') {
        query.pageNumber = 1
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
        query.pageNumber = 1
      }
      if (type === 'category') {
        query.pageNumber = 1
        let path = `/goods/${categoryNo}`
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
  }
}
</script>
