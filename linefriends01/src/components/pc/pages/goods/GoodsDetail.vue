<template>
  <div class="goods-detail">
    <main-wrapper>
      <layout-width>
        <goods-detail-header v-if="product && options" ref="goodsDetailHeader" :items="product" :ordCnt="orderCnt" />
      </layout-width>
      <div class="goods-detail__tab">
        <detail-tab ref="detailTab" :ordCnt="orderCnt" @childs-event="tabView" @buy="() => $refs.goodsDetailHeader.buy()" @addToCart="() => $refs.goodsDetailHeader.addToCart('cart')" @likeIt="() => $refs.goodsDetailHeader.likeIt()" />
      </div>
      <layout-width>
        <div v-show="tabStatus === 'info'" class="goods-detail__explanation">
          <detail-info :product="product" />
        </div>
        <div v-if="tabStatus === 'review'" class="goods-detail__review">
          <detail-review />
        </div>
        <div v-if="tabStatus === 'contact'" class="goods-detail__contact">
          <detail-contact />
        </div>
        <div v-show="tabStatus === 'buyinfo'" class="goods-detail__buyinfo">
          <detail-buy-info :buyInfo="product" />
        </div>
      </layout-width>
    </main-wrapper>
    <div v-if="recommands&&recommands.length!=0" class="goods-detail__recommand">
      <detail-recommand :recommand="recommands" />
    </div>
  </div>
</template>
<script>
// import * as $ from 'jquery'

import LayoutWidth from '../../layout/common/LayoutWidth'
import MainWrapper from '../../layout/common/MainWrapper'

import GoodsDetailHeader from '../../goods/GoodsDetailHeader'
import DetailTab from '../../goods/DetailTab'
import DetailInfo from '../../goods/DetailInfo'
import DetailRecommand from '../../goods/DetailRecommand'
import DetailReview from '../../goods/DetailReview'
import DetailBuyInfo from '../../goods/DetailBuyInfo'
import DetailContact from '../../goods/DetailContact'

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Detail',
  components: {
    LayoutWidth,
    MainWrapper,
    GoodsDetailHeader,
    DetailTab,
    DetailInfo,
    DetailRecommand,
    DetailReview,
    DetailBuyInfo,
    DetailContact
  },
  data () {
    return {
      tabStatus: 'info',
      orderCnt: 1,
      goods: {},
      from: null
    }
  },
  computed: {
    ...mapGetters('product', ['product', 'options']),
    ...mapState('productreview', { reviewCount: 'totalCount' }),
    ...mapState('productinquiry', ['inquiryList']),
    ...mapState('productrecommand', { recommands: 'list' }),
    baseInfo () {
      const baseInfoJSON = this.product.baseInfo.baseInfoByJSON
      const contents = (baseInfoJSON && baseInfoJSON.contents) || {}
      return this.product ? contents : {}
    }
  },
  methods: {
    tabView (event) {
      if (event === 'info') {
        this.tabStatus = 'info'
      } else if (event === 'review') {
        this.tabStatus = 'review'
      } else if (event === 'contact') {
        this.tabStatus = 'contact'
      } else if (event === 'buyinfo') {
        this.tabStatus = 'buyinfo'
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => { vm.from = from })
  },
  beforeRouteUpdate (to, from, next) {
    this.tabStatus = 'info'
    this.$refs.detailTab.active = 'info'
    next()
  },
  beforeRouteLeave (to, from, next) {
    this.tabStatus = 'info'
    this.$refs.detailTab.active = 'info'

    if (
      !this.from ||
      to.name !== 'GoodsList' ||
      to.name !== this.from.name ||
      JSON.stringify(to.params) !== JSON.stringify(this.from.params)
    ) {
      this.$store.commit('productList/RESET_CUR_PAGE_NO')
    }

    next()
  }
}
</script>
