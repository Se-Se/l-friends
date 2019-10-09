<template>
  <div>
    <div
      @click="character()"
    >
      <main-wrapper>
        <layout-width>
          <bread-crumbs
            :basic="basicCrumbs"
          />
          <div v-if="totalCount !== 0 && totalCount !== null">
            <p class="goods-search__title">
              {{ $route.query.keyword }}<em> 검색결과</em>
            </p>
          </div>
        </layout-width>
      </main-wrapper>
    </div>
    <layout-width>
      <div class="goods-search">
        <div v-if="totalCount !== 0 && totalCount !== null">
          <goods-list-header
            ref="GoodsListHeader"
            :total="totalCount"
            :orderBy="orderBy"
            @search="search"
            @getOrderBy="getOrderBy"
          />
          <div class="goods-list__content">
              <goods-list
                :goods="list"
                mode="list"
                :interval="true"
              />
              <div class="goods-search__pagination">
                <pagination
                  v-model="page"
                  :total="totalCount"
                  :limit="20"
                  :size="10"
                  @input="onMovePage"
                />
              </div>
          </div>
        </div>
        <search-no-data
          v-if="totalCount === 0"
          :keyword="$route.query.keyword"
        />
      </div>
    </layout-width>
    <div
      v-if="totalCount === 0"
      class="detail-recommand"
    >
      <layout-width>
        <h2 class="detail-recommand__title">{{title}}</h2>
        <div calss="detail-recommand__content">
          <goods-list
            :goods="bestGoods"
            mode="recommand"
          />
        </div>
      </layout-width>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import MainWrapper from '../../layout/common/MainWrapper'
import LayoutWidth from '../../layout/common/LayoutWidth'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import GoodsList from '../../goods/GoodsList'
import GoodsListHeader from '../../goods/GoodsListHeader'
import Pagination from '../../assets/Pagination'
import SearchNoData from '@/components/pc/pages/search/SearchNoData'

export default {
  name: 'Search',
  components: {
    MainWrapper,
    LayoutWidth,
    BreadCrumbs,
    GoodsList,
    GoodsListHeader,
    Pagination,
    SearchNoData
  },
  data () {
    return {
      basicCrumbs: '홈',
      page: this.$router.currentRoute.params.page || 1,
      title: '',
      orderBy: 'MD_RECOMMEND|ASC'
    }
  },
  computed: {
    ...mapState('productrecommand', { recommands: 'list' }),
    ...mapState('productList', ['list', 'totalCount']),
    ...mapState('display', ['best']),
    bestGoods () {
      return this.best ? this.best.mainBestProductInfos.map(item => ({
        ...item,
        productNo: item.productNo,
        listImageUrls: [item.imageUrls[0]],
        imageUrls: [item.imageUrls[0]]
      })).slice(0, 5) : []
    }
  },
  async created () {
    await this.fetchGoodsBest()

    this.title = this.$t('article.best.title.' + this.best.mainBestSearchType)
  },
  watch: {
    '$route' () {
      this.page = 1
    }
  },
  methods: {
    ...mapActions('display', ['fetchGoodsBest']),
    ...mapActions('productList', ['changeParams', 'fetchPage']),
    onMovePage () {
      this.fetchPage(this.page)
    },
    getOrderBy ({ order }) {
      this.orderBy = order
    },
    search ({ order, character }) {
      const query = order.split('|')
      this.changeParams({ 'order.by': query[0], 'order.direction': query[1] })
      this.page = 1
    },
    character () {
      this.$refs.GoodsListHeader.charViewClose()
    }
  }
}
</script>