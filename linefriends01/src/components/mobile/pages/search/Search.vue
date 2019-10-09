<template>
  <div>
    <div class="goods-search__header">
      <p class="goods-search__header-ico" @click="$router.go(-1)" />
      <input v-model="searchQuery" ref="searchQuery" class="goods-search__header-input" type="text" placeholder="검색어를 입력해주세요." @keyup.enter="search(searchQuery)">
      <span class="goods-search__header-delete" v-show="searchQuery" @click="removeSearchQuery" />
    </div>
    <div v-if="!keyword" class="goods-search__container">
      <div class="goods-search__recommend">
        <h2 class="goods-search__recommend-title">추천 검색어</h2>
        <ul class="goods-search__recommend-wrapper">
          <li v-for="(item, index) in favoriteKeywords" :key="index" class="goods-search__recommend-tag">
            <a href="#" @click.prevent="search(item)">{{ item }}</a>
          </li>
        </ul>
      </div>
      <div class="goods-search__recent" v-if="isLogined">
        <div class="goods-search__recent-header">
          <h2 class="goods-search__recent-title">최근 검색어</h2>
          <span class="goods-search__recent-all" v-if="searchHistory.length > 0"><a href="#" @click.prevent="REMOVE_SEARCH_LOG_ALL">전체삭제</a></span>
        </div>
        <p class="goods-search__recent-nodata" v-if="searchHistory.length === 0">최근 검색한 기록이 없습니다.</p>
        <div class="goods-search__recent-data" v-else>
          <ul class="goods-search__recent-list">
            <li v-for="(item, key) in searchHistory" :key="key" class="goods-search__recent-article" @click="search(item)">
              <p class="goods-search__recent-article__title">{{ item }}</p>
              <span class="delete" @click.stop="REMOVE_SEARCH_LOG(item)" />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="container" v-else>
      <main-article :padding-top="2">
        <template v-if="totalCount > 0">
          <goods-search-form @search="changeParam" />
          <p class="search-result">
            <strong>{{ totalCount }}</strong>개의 상품이 조회되었습니다.
          </p>
          <goods-list :goods="list" />
        </template>
        <div v-else class="goods-search-result__nodata">
          <not-found description="검색 결과가 없습니다.">
            <div class="goods-search-result__nodata-button">
              <app-button size="middle-large" to="/">
                메인으로 돌아가기
              </app-button>
            </div>
          </not-found>
        </div>
      </main-article>
      <main-article v-if="totalCount === 0" background="#f6f6f6" :title="title" :padding-side="0" left>
        <goods-list v-if="best" :padding-side="2" :width="19.4" direction="horizontal" skin="box" :goods="bestGoods" />
      </main-article>
    </div>
  </div>
</template>
<script>
import GoodsBestArticle from '@/components/mobile/goods/GoodsBestArticle'
import MainArticle from '@/components/mobile/main/MainArticle'
import GoodsSearchForm from '@/components/mobile/goods/GoodsSearchForm'
import GoodsList from '@/components/mobile/goods/GoodsList'
import NotFound from '@/components/mobile/goods/detail/NotFound'
import AppButton from '@/components/mobile/common/button/Button'
import { onScrollNextPage, Alert } from '@/utils/event-bus'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { gaEventSearch } from '@/utils/gaEventUtils'
export default {
  name: 'GoodsSearch',
  components: {
    GoodsBestArticle,
    MainArticle,
    GoodsSearchForm,
    GoodsList,
    NotFound,
    AppButton
  },
  data () {
    return {
      searchQuery: this.$route.query.keyword,
      title: ''
    }
  },
  computed: {
    ...mapState('product', ['inputFavoriteKeywords']),
    ...mapGetters(['isLogined']),
    ...mapState('productList', ['list', 'totalCount', 'searchHistory']),
    ...mapState('display', ['best']),
    bestGoods () {
      return this.best.mainBestProductInfos.map(item => ({
        ...item,
        productNo: item.productNo,
        listImageUrls: [item.imageUrls[0]],
        imageUrls: [item.imageUrls[0]]
      }))
    },
    favoriteKeywords () {
      return this.inputFavoriteKeywords ? this.inputFavoriteKeywords.slice(0, 8) : []
    },
    keyword () {
      return this.$route.query.keyword
    }
  },
  watch: {
    $route (next) {
      this.searchQuery = next.query.keyword
    }
  },
  async mounted () {
    this.$store.dispatch('product/_getInputFavoriteKeywords')

    await this.fetchGoodsBest()

    this.title = this.$t('article.best.title.' + this.best.mainBestSearchType)

    onScrollNextPage(async () => {
      if (this.keyword && (this.list ? this.list.length : 0) < this.totalCount) {
        await this.fetchMore()
      }
    })
  },
  methods: {
    ...mapActions('display', ['fetchGoodsBest']),
    ...mapActions('productList', ['changeParams', 'fetchMore', 'removeSearchHistory']),
    ...mapMutations('productList', ['REMOVE_SEARCH_LOG', 'REMOVE_SEARCH_LOG_ALL']),
    removeSearchQuery () {
      this.searchQuery = ''
      this.isResult = false
      this.$refs.searchQuery.focus()
    },
    changeParam ({ order, character }) {
      const query = order.split('|')

      this.changeParams({ 'order.by': query[0], 'order.direction': query[1] })
    },
    search (query) {
      if (query) {
        gaEventSearch(query)
        this.$router.replace({ path: `/goods/search?sortBy=MD_RECOMMEND:ASC&keyword=${encodeURIComponent(query)}` })
        this.$refs.searchQuery.blur()
      } else {
        Alert({
          title: '검색',
          message: '검색어를 입력해주세요'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-search {
  &__header {
    display: flex;
    position: relative;
    height: 5.6rem;
    background-color: #fff;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    &-ico {
      width: 3.2rem;
      height: 3.2rem;
      margin: 1.2rem 0.8rem;
      background-image: url(~@/assets/images/mobile/back.svg);
      background-size: cover;
    }
    &-input {
      padding: 1.6rem 0 1.63rem;
      font-size: 1.6rem;
      font-family: "Noto Sans KR";
      letter-spacing: -0.01rem;
      line-height: normal;
    }
    input::placeholder {
      color: rgba(51, 51, 51, 0.4);
    }
    &-delete {
      position: absolute;
      right: 2rem;
      width: 2.4rem;
      height: 2.4rem;
      background-image: url(~@/assets/images/mobile/ic-close-round.svg);
      background-size: cover;
    }
  }
  &__container {
    height: calc(100vh - 5.6rem);
    padding: 0 2rem;
    background-color: #fafafa;
  }
  &__recommend {
    padding-top: 2rem;
    &-title {
      color: #333333;
      font-size: 1.2rem;
      font-weight: bold;
      font-family: "Noto Sans KR";
      line-height: normal;
      letter-spacing: -0.01rem;
    }
    &-wrapper {
      padding-top: 2rem;
      font-size: 0;
    }
    &-tag {
      display: inline-block;
      margin: 0 0.8rem 0.8rem 0;
      padding: 0.6rem 1.23rem 0.53rem 1.2rem;
      border: 1px solid #eeeeee;
      border-radius: 1.6rem;
      background-color: #fff;
      text-align: center;
      a {
        color: #333333;
        font-size: 1.4rem;
        font-family: "Noto Sans KR";
        line-height: normal;
        letter-spacing: -0.01rem;
      }
    }
  }
  &__recent {
    padding-top: 5.2rem;
    &-header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 1.2rem;
      font-family: "Noto Sans KR";
      line-height: normal;
      letter-spacing: -0.01rem;
    }
    &-title {
      color: #333333;
      font-weight: bold;
    }
    &-all {
      color: #666666;
    }
    &-nodata {
      margin-top: 3.7rem;
      color: #666666;
      font-size: 1.4rem;
      font-family: "Noto Sans KR";
      line-height: normal;
      letter-spacing: -0.01rem;
      text-align: center;
    }
    &-data {
      padding-top: 1.3rem;
    }
    &-article {
      display: flex;
      padding-bottom: 0.5rem;
      color: #333333;
      font-size: 1.4rem;
      font-family: "Noto Sans KR";
      line-height: 2.29;
      letter-spacing: -0.01rem;
      align-items: center;
      justify-content: space-between;
      &__title {
        max-width: 30rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .delete {
        width: 2rem;
        height: 2rem;
        background-image: url(~@/assets/images/mobile/ic-close-round-list.svg);
        background-size: cover;
      }
    }
  }

  &-result__nodata {
    margin-top: -4rem;
    &-button {
      padding-top: 2.33rem;
    }
  }
}
.search-result {
  margin: 4.4rem 0 3.6rem;
  height: 2.133rem;
  line-height: 1;
  font-size: 1.4rem;
  font-family: "Noto Sans KR";
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
