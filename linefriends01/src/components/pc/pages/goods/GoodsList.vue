<template>
  <div class="goods-list">
    <div
      @click="character()"
    >
      <main-wrapper>
        <layout-width>
          <bread-crumbs
            :active="categoryLabel"
          />
          <div class="goods-list__title">
            <main-title :title="getListTitle" />
          </div>
          <div
            v-if="$route.meta.showTopBanner"
            class="goods-list__banner">
              <figure v-if="topBanner">
                <a @click.prevent="goTarget(topBanner)" href="#">
                  <img
                    class="goods-list__image"
                    :src="topBanner.imageUrl"
                    :alt="topBanner.name"
                    :title="topBanner.name"/>
                </a>
              </figure>
          </div>
          <goods-tabs v-if="categorieTabDepth1" />
        </layout-width>
      </main-wrapper>   
    </div>
    <layout-width>
      <goods-list-header
        ref="GoodsListHeader"
        :total="total"
        @search="search"
      />
      <div class="goods-list__content">
        <template v-if="loading">
          로딩중 입니다.
        </template>
        <template v-else-if="goods && total">
          <goods-list
            v-if="goods"
            :goods="goods"
            mode="list"
          />
        </template>
        <template v-else>
          <div class="goods-list_nodata">
            <figure class="goods-list_nodata--image">
              <img
                src="~@/assets/images/pc/icons/ic-nodata-brown.jpg"
                :alt="$t('goods.list.notfound')"
                :title="$t('goods.list.notfound')"
              >
            </figure>
            <p class="goods-list_nodata--title">
              {{ $t('goods.list.notfound') }}
            </p>
          </div>
        </template>
      </div>
      <pagination
        v-model="page"
        :total="total"
        :limit="20"
        :size="10"
        @input="onMovePage"
      />
    </layout-width>
  </div>
</template>
<script>
import LayoutWidth from '../../layout/common/LayoutWidth'
import MainWrapper from '../../layout/common/MainWrapper'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import MainTitle from '../../mypage/MainTitle'
import Pagination from '../../assets/Pagination'
import GoodsListHeader from '../../goods/GoodsListHeader'
import GoodsList from '../../goods/GoodsList'
import GoodsTabs from '../../goods/GoodsTabs'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'List',
  components: {
    LayoutWidth,
    MainWrapper,
    BreadCrumbs,
    MainTitle,
    Pagination,
    GoodsListHeader,
    GoodsList,
    GoodsTabs
  },
  computed: {
    ...mapGetters('banners', ['allCategoryBanners']),
    ...mapGetters('categories', ['categorieTabDepth1', 'categorieTabDepth2', 'currentCategory']),
    ...mapState('productList', { goods: 'list', total: 'totalCount', currentPage: 'currentPage', loading: 'apiLoading' }),
    topBanner () {
      return this.allCategoryBanners ? this.allCategoryBanners[0] : null
    },
    getListTitle () {
      if (this.categorieTabDepth1) {
        return this.categorieTabDepth1.label
      } else {
        return this.$route.meta.title
      }
    },
    categoryLabel () {
      let category = this.$route.meta.title
      if (this.categorieTabDepth1 || this.categorieTabDepth2) {
        category = []
        category.push({
          'value': this.categorieTabDepth1.label,
          'link': '/goods/' + this.categorieTabDepth1.categoryNo
        })
        if (this.categorieTabDepth2) {
          category.push({
            'value': this.categorieTabDepth2.label,
            'link': '/goods/' + this.categorieTabDepth1.categoryNo + '/' + this.categorieTabDepth2.categoryNo
          })
        }
      }
      if (this.categorieTabDepth1 || this.categorieTabDepth2) {
        document.title = (this.categorieTabDepth2) ? this.categorieTabDepth2.label + ' - LINE FRIENDS' : this.categorieTabDepth1.label + ' - LINE FRIENDS'
      }
      if (this.$route.query.brandName) {
        document.title = this.$route.query.brandName + ' - LINE FRIENDS'
      }
      return category
    }
  },
  mounted () {
    this.allCategoryBanner()
    this.page = this.currentPage
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs.GoodsListHeader.charView === true) {
      this.$refs.GoodsListHeader.charViewToggle()
    }

    next()
  },
  beforeRouteUpdate (to, from, next) {
    this.page = 1
    next()
  },
  methods: {
    ...mapActions('banners', ['allCategoryBanner']),
    ...mapActions('productList', ['changeParams', 'fetchPage', 'setCurrentPageNo']),
    onMovePage () {
      this.setCurrentPageNo(this.page)
      this.fetchPage(this.page)
    },
    search ({ order, character }) {
      const query = order.split('|')
      this.page = 1
      this.changeParams({ 'order.by': query[0], 'order.direction': query[1] })
    },
    character () {
      this.$refs.GoodsListHeader.charViewClose()
    },
    goTarget (project) {
      if (project.landingUrlType === 'EVENT') {
        if (project.browerTargetType === 'CURRENT') {
          this.$router.push(`/event/${project.landingUrl}`)
        } else {
          let routeData = this.$router.resolve({ path: `/event/${project.landingUrl}` })
          window.open(routeData.href, '_blank')
        }
      } else {
        let landingUrl = project.landingUrl.indexOf('https://') !== -1 || project.landingUrl.indexOf('http://') !== -1 ? project.landingUrl : `https://${project.landingUrl}`
        if (project.browerTargetType === 'CURRENT') {
          window.location.href = landingUrl
        } else {
          window.open(landingUrl)
        }
      }
    }
  },
  data () {
    return {
      banners: {
        'img': '/images/pc/banner/main-banner.jpg'
      },
      page: this.currentPage
    }
  }
}
</script>
