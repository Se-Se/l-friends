<template>
  <div id="container" class="list">
    <div class="wrap">
      <bread-crumbs />
      <h1 class="result_title">
        <span class="green">{{keyword}}</span>検索結果
      </h1>

      <list-filter :pageSize="pageSize" :totalCount="totalCount || 0" :fetchListParams="fetchListParams" @searchList="searchList" />

      <template v-if="list && totalCount">
        <product-list :list="list" />
        <pagination v-model="pageIdx" :total="totalCount" :limit="pageSize" type="list" @goPage="pageChange" />
      </template>
      <div class="result_no_wrap" v-else-if="!pending.list">
        <div class="result_no_wrap_top">
          <div class="result_no_info">
            <dl>
              <dt><img class="no_img" src="@/assets/img/common/img_error.png" alt=""></dt>
              <dd>検索結果が見つかりません。</dd>
            </dl>
            <div class="reback_btn_wrap w-335">
              <router-link to="/" class="btn btn_green">トップページへ戻る</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <search-best v-if="(!list || !totalCount) && !pending.list" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BreadCrumbs from '@/components/common/BreadCrumbs'
import ListFilter from '@/components/search/ListFilter'
import ProductList from '@/components/search/ProductList'
import Pagination from '@/components/common/Pagination'
import SearchBest from '@/components/search/SearchBest'

export default {
  data () {
    return {
      keyword: this.$route.query.keyword
    }
  },
  components: {
    BreadCrumbs,
    ListFilter,
    ProductList,
    Pagination,
    SearchBest
  },
  computed: {
    ...mapState('search', ['list', 'totalCount', 'fetchListParams', 'pending']),
    pageIdx () {
      return this.fetchListParams && this.fetchListParams.pageNumber ? this.fetchListParams.pageNumber : 1
    },
    pageSize () {
      return this.fetchListParams && this.fetchListParams.pageSize ? this.fetchListParams.pageSize : 40
    }
  },
  methods: {
    pageChange (pageNo) {
      this.searchList({ type: 'pageIdx', pageNo })
    },
    searchList ({ type, pageNo, pageSize, sortType, brandNos }) {
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
      this.$router.push({
        path: this.$route.path,
        query
      })
    }
  },
  watch: {
    '$route.query.keyword' () {
      this.keyword = this.$route.query.keyword
    }
  }
}
</script>
