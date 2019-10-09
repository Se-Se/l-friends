<template>
  <div id="container" class="detail">
    <sub-product-header :showClose="false" :showBack="true" />
    <div class="detail_wrapper">
      <template v-if="product && product.baseInfo">
        <goods-thumb-slide :images="product.baseInfo.imageUrls" />
      </template>
      <div class="ttl_area" ref="ttArea">
        <ul class="ohter">
          <li><span class="badge badge_orange " v-if="isLittle">あとわずか</span></li>
          <li><span class="badge badge_purple" v-if="product && product.mainBestProductYn">BEST</span></li>
          <li><span class="badge badge_reserved" v-if="isPreOrderPeriods">予約商品</span></li>
          <li><span class="badge badge_blue" v-if="coupons.length > 0">クーポン</span></li>
          <li><span class="badge badge_blue_2 badge_titletop" v-if="product && product.baseInfo && isNew(product.baseInfo.registerYmdt) && !product.mainBestProductYn">NEW</span></li>
        </ul>
        <p class="txt_sub" v-if="product && product.baseInfo && product.baseInfo.promotionText">{{product.baseInfo.promotionText}}</p>
        <h2 class="ttl_h2" v-if="product && product.baseInfo"> {{ product.baseInfo.productName }}<br><span v-if="product.baseInfo.purchaseGuide">{{product.baseInfo.purchaseGuide}}</span></h2>
        <goods-coupon :goods="product" />
        <div class="reservation">
          <div class="reservation_intro">
            <dl>
              <dt>
                <h3 class="ttl_h3">送料</h3>
              </dt>
              <template v-if="product && product.deliveryFee && product.deliveryFee.deliveryConditionType === 'FREE'">
                <dd>無料<br>
                  - 1~2営業日以内に出荷（土日祝休業）</dd>
              </template>
              <template v-else>
                <dd v-if="product && product.deliveryFee">{{product.deliveryFee.defaultDeliveryConditionLabel}}<br>
                  - 1~2営業日以内に出荷（土日祝休業）</dd>
              </template>
            </dl>
          </div>
          <div class="reservation_intro_reservation" v-if="product && product.reservationData && (reservationLeftDate > 0 || isPreOrderPeriod)">
            <h3 class="ttl_h3">予約商品の案内</h3>
            <dl>
              <dt>注文可能期間</dt>
              <dd>{{ product.reservationData.reservationStartYmdt | dateFormatStr('yyyy.MM.dd') }} - {{ product.reservationData.reservationEndYmdt | dateFormatStr('yyyy.MM.dd') }}
                <template v-if="isPreOrderPeriod">
                  (<span class="date">{{ reservationLeftDate }}</span>日)
                </template>
              </dd>
            </dl>
            <dl>
              <dt>配送開始日</dt>
              <dd>{{ product.reservationData.reservationDeliveryYmdt | dateFormatStr('yyyy.MM.dd') }}日から順次発送</dd>
            </dl>
            <dl>
              <dt>送料</dt>
              <template v-if="product">
                <dd>{{ product.deliveryFee ? product.deliveryFee.defaultDeliveryConditionLabel : '-' }}</dd>
              </template>
            </dl>
          </div>
        </div>
      </div>
      <div class="tab_list_area" ref="goodsInfo" v-if="product && product.counter">
        <border-tab-container ref="detailTab" :tabName="tabType" :count="{ review: product.counter.reviewCnt, inquiry: inquiryList.totalCount }" :bus="tabBus" :tabs="{ '商品説明': 'info', 'レビュー': 'review', '商品お問い合わせ': 'inquiry'}" :goods="true" class="goods-info__nav" @click="showBuy" @changeTab="changeTb" v-if="inquiryList">

        </border-tab-container>
      </div>
      <tab-content :bus="tabBus" tab-id="info">
        <goods-info :product="product" />
      </tab-content>
      <tab-content :bus="tabBus" tab-id="review">
        <goods-reviews ref="GoodsReviews" />
      </tab-content>
      <tab-content :bus="tabBus" tab-id="inquiry">
        <goods-inquiry ref="GoodsInquiry" @update="scrollToTop" @goToInquiry="goToInquiry" />
      </tab-content>
    </div>
    <!-- ====▼▼▼▼▼ option-product-buy-item ▼▼▼▼▼==== -->
    <goods-buy class="buy_tab_sticky" ref="GoodsBuy" :goods="product" />
    <!-- ====▲▲▲▲▲ option-product-buy-item ▲▲▲▲▲==== -->

  </div>
</template>

<script>
import Vue from 'vue'
import SubProductHeader from '@/components/header/SubProductHeader'
import GoodsThumbSlide from '@/components/goods/GoodsThumbSlide'
import BorderTabContainer from '@/components/goods/tab/BorderTabContainer'
import TabContent from '@/components/goods/tab/TabContent'
import GoodsInfo from '@/components/goods/GoodsInfo'
import GoodsReviews from '@/components/goods/GoodsReviews'
import GoodsInquiry from '@/components/goods/GoodsInquiry'
import GoodsBuy from '@/components/goods/GoodsBuy'
import GoodsCoupon from '@/components/goods/GoodsCoupon'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { includeNow } from '@/utils/dateUtils'
import $ from 'jquery'
export default {
  name: 'GoodsDetail',
  components: {
    SubProductHeader,
    GoodsThumbSlide,
    BorderTabContainer,
    TabContent,
    GoodsInfo,
    GoodsReviews,
    GoodsInquiry,
    GoodsBuy,
    GoodsCoupon
  },
  data () {
    return {
      tabBus: new Vue(),
      scrollEvent: null,
      tabType: 'info'
    }
  },
  computed: {
    ...mapGetters('product', ['product']),
    ...mapGetters('coupon', ['getCoupons']),
    ...mapState('productinquiry', ['inquiryList']),
    ...mapState('review', ['productReviews', 'pending']),
    isLittle () {
      if (this.isPreOrderPeriod && this.product.reservationData) {
        if (this.product.reservationData.reservationStockCnt < 5 && this.product.reservationData.reservationStockCnt > 0) {
          return true
        }
        return false
      } else {
        if (this.product && this.product.stock && this.product.stock.stockCnt < 5 && this.product.stock.stockCnt > 0) {
          return true
        }
        return false
      }
    },
    coupons () {
      return this.getCoupons || []
    },
    isRateCoupon () {
      return this.coupons[0].discountInfo.discountAmt === null
    },
    downloadableCoupons () {
      return this.coupons.filter(item => item.downloadable)
    },
    reservationLeftDate () {
      return Math.ceil((new Date(this.product.reservationData.reservationEndYmdt.replace(' ', 'T')) - new Date()) / (1000 * 3600 * 24))
    },
    isPreOrderPeriods () {
      if (this.product && this.product.reservationData) {
        return includeNow(this.product.reservationData.reservationStartYmdt, this.product.reservationData.reservationEndYmdt)
      }
      return false
    },
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.product && this.product.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.product.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.product.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    }
  },
  created () {
    this.tabBus.$on('tab-change', id => {
      this.scrollToTop()
      if (id === 'review') {
        this.$nextTick(() => {
          // this.$refs.GoodsReviews.init()
        })
      } else if (id === 'inquiry') {
        this.$nextTick(() => {
          this.RESET_INQUERY_ITEM()
          this.fetchProductInquiry({ pageNo: 1, pageSize: 5, productNo: this.$route.params.goodsNo })
          this.$refs.GoodsInquiry.init()
        })
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    $('html,body').css({
      'overflow-x': '',
      'overflow-y': ''
    })
    next()
  },
  updated () {
    this.scrollTab()
    this.$refs.ttArea.style.position = 'static'
  },
  mounted () {
    this.showBuy()
    this.fromInquiryScroll()
    this.scrollTab()
  },
  destroyed () {
  },
  beforeRouteUpdate (to, from, next) {
    this.$refs.GoodsBuy.optionsInit(to.params.goodsNo)
    $('html, body').animate({ scrollTop: this.$route.query.currScroll })
    next()
  },
  methods: {
    ...mapMutations('productinquiry', ['RESET_INQUERY_ITEM']),
    ...mapMutations('review', ['RESET_REVIEWS_ITEM']),
    ...mapActions('review', ['fetchProductReviews']),
    ...mapActions('productinquiry', ['fetchProductInquiry']),
    goToInquiry () {
      let tabTop = $('html ,body').scrollTop()
      setTimeout(() => {
        this.$refs.detailTab.active = 'inquiry'
        this.tabBus.$emit('tab-change', 'inquiry')
        $('html, body').animate({ scrollTop: tabTop })
      }, 1000)
    },
    changeTb (data) {
      this.tabType = data
    },
    showBuy () {
      if (this.productReviews && this.productReviews.items && this.productReviews.items.length > 0) {
        this.RESET_REVIEWS_ITEM()
        this.fetchProductReviews({ pageNo: 1, pageSize: 5, productNo: this.$route.params.goodsNo, orderBy: 'RECOMMEND' })
      }
      if (this.inquiryList && this.inquiryList.item && this.inquiryList.item.length > 0) {
        this.RESET_INQUERY_ITEM()
        this.fetchProductInquiry({ pageNo: 1, pageSize: 5, productNo: this.$route.params.goodsNo })
      }
      this.$refs.GoodsReviews.page = 1
      this.$nextTick(() => {
        if ($('.footer').offset().top - $(window).scrollTop() > $(window).height()) {
          $('.buy_tab_sticky').addClass('buygroup')
        } else {
        }
      })
      $(window).scroll(() => {
        if (this.$refs.GoodsBuy) {
          if ($('.footer').offset()) {
            if ($('.footer').offset().top - $(window).scrollTop() + $('.buy_tab_sticky').height() < $(window).height()) {
              this.$nextTick(() => {
                $('.buy_tab_sticky').addClass('buygroup')
              })
            } else {
              $('.buy_tab_sticky').removeClass('buygroup')
            }
          }
        } else {
          $('.buy_tab_sticky').addClass('buygroup')
        }
      })
    },
    isNew (itemRegisterYmdt) {
      let currentDate = new Date()
      return currentDate.getTime() < this.fun_date2(itemRegisterYmdt).getTime()
    },
    fun_date2 (data) {
      let date1 = new Date(data.replace(/-/g, '/'))
      date1.setDate(date1.getDate() + 7)
      return date1
    },
    scrollToTop () {
      const bodyOffsetTop = this.$refs.ttArea.offsetTop + this.$refs.ttArea.offsetHeight
      if (bodyOffsetTop < window.scrollY) {
        window.scrollTo(0, bodyOffsetTop)
      }
    },
    scrollTab () {
      window.addEventListener('scroll', () => {
        if (this.$refs.ttArea) {
          const bodyOffsetTop = this.$refs.ttArea.offsetTop + this.$refs.ttArea.offsetHeight
          if (this.$refs.goodsInfo) {
            if (window.scrollY > bodyOffsetTop) {
              this.$refs.goodsInfo.style.position = 'fixed'
              this.$refs.goodsInfo.style.left = '0'
              this.$refs.goodsInfo.style.top = '0'
              this.$refs.goodsInfo.style.width = '100%'
            } else if (window.scrollY < bodyOffsetTop) {
              if (this.$refs.goodsInfo) {
                this.$refs.goodsInfo.style.position = 'static'
              }
            }
          }
        }
      })
    },
    fromInquiryScroll () {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$route.query.tab && this.$refs.detailTab) {
            this.$refs.detailTab.active = this.$route.query.tab
            this.tabBus.$emit('tab-change', this.$route.query.tab)
            if (this.$route.query.currScroll) {
              $('html, body').animate({ scrollTop: this.$route.query.currScroll })
            }
            if (this.$route.query.openInquiryNo) {
              this.$refs.GoodsInquiry.setActive(Number(this.$route.query.openInquiryNo))
            }
          }
        }, 600)
      })
    }
  }
}
</script>

<style scoped>
.tab_list_area {
  z-index: 100;
}
</style>
