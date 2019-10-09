<template>
  <div class="main-page">
    <sub-page-header :title="title" />
    <category-nav v-if="categorieTabDepth1" />

    <div id="container">
      <image-banner
        v-if="$route.meta.showTopBanner"
        :banner="topBanner"
        class="image-banner"
      />

      <main-article :padding-top="1.6">
        <goods-search-form @search="search" />
        <p class="search-result">
          <strong>{{ total }}</strong>개의 상품이 조회되었습니다.
        </p>
        <template v-if="apiLoading">
          로딩중 입니다.
        </template>
        <goods-list-elem
          v-if="goods && total"
          :goods="goods"
        />
        <not-found
          v-else
          :height="25"
          :description="$t('goods.list.notfound')"
          character="brown"
        />
      </main-article>
    </div>
  </div>
</template>

<script>
import SubPageHeader from '../../layout/header/SubPageHeader'
import CategoryNav from '../../layout/header/CategoryNav'
import MainArticle from '../../main/MainArticle'
import ImageBanner from '../../common/banner/ImageBanner'
import GoodsSearchForm from '../../goods/GoodsSearchForm'
import GoodsListElem from '../../goods/GoodsList'
import NotFound from '../../common/list/NotFound'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import { onScrollNextPage } from '@/utils/event-bus'

export default {
  name: 'GoodsList',
  components: {
    SubPageHeader,
    CategoryNav,
    MainArticle,
    ImageBanner,
    GoodsSearchForm,
    GoodsListElem,
    NotFound
  },
  computed: {
    ...mapGetters('banners', ['allCategoryBanners']),
    ...mapGetters('categories', ['categorieTabDepth1', 'currentCategory']),
    ...mapState('productList', { goods: 'list', total: 'totalCount', apiLoading: 'apiLoading' }),
    topBanner () {
      return this.allCategoryBanners ? this.allCategoryBanners[0] : null
    },
    title () {
      return this.categorieTabDepth1 ? this.categorieTabDepth1.label : this.$route.meta.title
    }
  },
  mounted () {
    this.allCategoryBanner()

    onScrollNextPage(async () => {
      if (this.goods && this.goods.length < this.total) {
        await this.fetchMore()
      }
    })
  },
  methods: {
    ...mapActions('banners', ['allCategoryBanner']),
    ...mapActions('productList', ['changeParams', 'fetchMore']),
    search ({ order, character }) {
      const query = order.split('|')

      this.changeParams({ 'order.by': query[0], 'order.direction': query[1] })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-result {
  margin: 4.4rem 0 3.6rem;
  height: 2.133rem;
  line-height: 1;
  font-size: 1.4rem;
  font-family: 'Noto Sans KR';
  letter-spacing: -0.01rem;
  font-weight: normal;
  color: #aaa;
  text-align: center;
  vertical-align: middle;

  > strong {
    display: inline-block;
    font-family: Volte, sans-serif;
    font-weight: 600;
    color: #00d564;
    margin-right: 0.3rem;
  }
}
</style>
