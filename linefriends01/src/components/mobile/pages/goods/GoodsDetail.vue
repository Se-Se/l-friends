<template>
  <div>
    <sub-page-header title="상품정보" :product="product" />

    <div class="goods-detail-container">
      <div class="goods-image-slide">
        <goods-thumb-slide :product="product" />
        <div class="goods-badges">
          <span v-if="isNew(productInfo.baseInfo.saleStartYmdt) && !productInfo.mainBestProductYn" class="goods-badges__item new">NEW</span>
          <span v-if="productInfo.mainBestProductYn" class="goods-badges__item best">BEST</span>
        </div>
      </div>
      <div class="goods-slide-info">
        <ul class="goods-sticker">
          <li v-if="productInfo.status.soldout" class="goods-sticker__item soldout">
            {{ $t('goods.tags.soldout') }}
          </li>
          <li v-if="coupons.length > 0" class="goods-sticker__item coupon">
            <!-- isRateCoupon ? coupons[0].discountInfo.discountRate : coupons[0].discountInfo.discountAmt -->{{ $t('goods.coupon') }}
            <!-- isRateCoupon ? '%' : '원' TODO 요청으로 쿠폰 % 제외 -->
          </li>
          <li v-if="isPreOrderPeriod" class="goods-sticker__item reserve">
            {{ $t('goods.tags.reserve') }}
          </li>
        </ul>
        <p class="goods-sub-title" v-if="productInfo.baseInfo.promotionText">
          {{ productInfo.baseInfo.promotionText }}
        </p>
        <p class="goods-title">
          {{ productInfo.baseInfo.productName }}
        </p>
        <div class="goods-coupon">
          <goods-coupon />
        </div>
        <div v-if="productInfo.reservationData && (reservationLeftDate > 0 || isPreOrderPeriod)" class="goods-reserve">
          <h2 class="goods-reserve__title">예약상품안내</h2>
          <dl class="goods-reserve__info">
            <dt>주문 가능 기간</dt>
            <dd>
              {{ productInfo.reservationData.reservationStartYmdt | dateFormatStr('yyyy.MM.dd') }} -
              {{ productInfo.reservationData.reservationEndYmdt | dateFormatStr('yyyy.MM.dd') }}
              <template v-if="isPreOrderPeriod">
                (<em>{{ reservationLeftDate }}</em>일 남음)
              </template>
            </dd>
          </dl>
          <dl class="goods-reserve__info">
            <dt>배송 시작일</dt>
            <dd>{{ productInfo.reservationData.reservationDeliveryYmdt | dateFormatStr('yyyy.MM.dd') }}일 부터 순차 배송</dd>
          </dl>
          <dl class="goods-reserve__info">
            <dt>배송비</dt>
            <dd>{{ productInfo.deliveryFee ? productInfo.deliveryFee.defaultDeliveryConditionLabel : '-' }}</dd>
          </dl>
        </div>
      </div>
      <div class="goods-info" ref="goodsInfo">
        <border-tab-container ref="detailTab" :bus="tabBus" :tabs="{ '상품설명': 'info', '상품평': 'review', '상품문의': 'inquiry', '구매정보': 'buyInfo' }" :count="{ review: productInfo.counter.reviewCnt, inquiry: productInfo.counter.inquiryCnt }" :goods=true class="goods-info__nav">
          <tab-content :bus="tabBus" tab-id="info">
            <goods-info :product="productInfo" />
          </tab-content>

          <tab-content :bus="tabBus" tab-id="review">
            <goods-reviews ref="GoodsReviews" />
          </tab-content>

          <tab-content :bus="tabBus" tab-id="inquiry">
            <goods-inquiry ref="GoodsInquiry" @update="scrollToTop" />
          </tab-content>

          <tab-content :bus="tabBus" tab-id="buyInfo">
            <goods-buy-info :product="productInfo" />
          </tab-content>
        </border-tab-container>
      </div>
    </div>

    <goods-buy ref="GoodsBuy" :goods="product" />
  </div>
</template>

<script>
import Vue from 'vue'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import GoodsThumbSlide from '@/components/mobile/goods/GoodsThumbSlide'
import BorderTabContainer from '@/components/mobile/common/tab/BorderTabContainer'
import TabContent from '@/components/mobile/common/tab/TabContent'
import GoodsInfo from '@/components/mobile/goods/detail/GoodsInfo'
import GoodsReviews from '@/components/mobile/goods/detail/GoodsReviews'
import GoodsInquiry from '@/components/mobile/goods/detail/GoodsInquiry'
import GoodsBuyInfo from '@/components/mobile/goods/detail/GoodsBuyInfo'
import GoodsBuy from '@/components/mobile/goods/detail/GoodsBuy'
import GoodsCoupon from '@/components/mobile/goods/detail/GoodsCoupon'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'GoodsDetail',
  components: {
    SubPageHeader,
    GoodsThumbSlide,
    BorderTabContainer,
    TabContent,
    GoodsInfo,
    GoodsReviews,
    GoodsInquiry,
    GoodsBuyInfo,
    GoodsBuy,
    GoodsCoupon
  },
  data () {
    return {
      tabBus: new Vue()
    }
  },
  computed: {
    ...mapGetters('product', ['product']),
    ...mapGetters('coupon', ['getCoupons']),
    productInfo () {
      return this.product || {
        baseInfo: {},
        status: {},
        price: {}
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
        this.$refs.GoodsReviews.init()
      } else if (id === 'inquiry') {
        this.$refs.GoodsInquiry.init()
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.$route.query.tab) {
          this.$refs.detailTab.active = this.$route.query.tab
          this.tabBus.$emit('tab-change', this.$route.query.tab)
          if (this.$route.query.currScroll) {
            window.scrollTo(0, this.$route.query.currScroll)
          }
          if (this.$route.query.openInquiryNo) {
            this.$refs.GoodsInquiry.setActive(Number(this.$route.query.openInquiryNo))
          }
        }
      }, 500)
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$refs.GoodsBuy.openOption = false
    next()
  },
  methods: {
    isNew (itemRegisterYmdt) {
      let currentDate = new Date()
      if (this.isPreOrderPeriod) {
        return currentDate.getTime() < this.fun_date2(this.product.reservationData.reservationStartYmdt).getTime()
      } else {
        return currentDate.getTime() < this.fun_date2(itemRegisterYmdt).getTime()
      }
    },
    fun_date2 (data) {
      let date1 = new Date(data)
      date1.setDate(date1.getDate() + 7)
      return date1
    },
    scrollToTop () {
      const bodyOffsetTop = this.$refs.goodsInfo.offsetTop
      if (bodyOffsetTop < window.scrollY) {
        window.scrollTo(0, bodyOffsetTop)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  max-width: 100%;
}
.goods {
  &-slide-info {
    padding: 0 2rem 4.8rem;
  }

  &-detail-container {
    min-height: 5rem;
  }

  &-sub-title {
    padding: 0 2rem;
    font-family: "Noto Sans KR";
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #999;
  }

  &-title {
    padding: 0 2rem;
    margin-top: 0.3rem;
    font-family: "Noto Sans KR";
    font-size: 2.4rem;
    font-weight: bold;
    line-height: 1.33;
    letter-spacing: -0.01rem;
    text-align: center;
    word-break: keep-all;
    word-wrap: break-word;
    color: #333;
  }

  &-info__nav {
    /deep/ .tab-nav {
      position: sticky;
      z-index: 1;
      top: -0.2rem;
      left: 0;
      width: 100%;
      background: #fff;
    }
  }

  &-image-slide {
    position: relative;
  }

  &-badges {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;

    &__item {
      line-height: 1;
      display: inline-block;
      width: 5.8rem;
      height: 3.2rem;
      padding-top: 0.8rem;
      text-align: center;
      color: #fff;
      font-size: 1.8rem;
      font-family: Volte, sans-serif;
      font-weight: 600;

      &.best {
        background: #df67ff;
      }

      &.new {
        background: #5388ff;
      }
    }
  }

  &-sticker {
    display: flex;
    justify-content: center;
    margin: 1.2rem 0 0.8rem;

    &__item {
      line-height: 1.6rem;
      padding: 0 0.7rem;
      border: 1px solid #4ba4d9;
      border-radius: 1.866rem;
      font-family: "Noto Sans KR", sans-self;
      font-size: 1rem;
      font-weight: 500;
      color: #4ba4d9;

      &:not(:last-child) {
        margin-right: 0.2rem;
      }

      &.coupon {
        background: #4ba4d9;
        color: #fff;
      }

      &.soldout {
        border: 1px solid #a5aab0;
        color: #a5aab0;
      }
    }
  }

  &-coupon {
    width: 10.9rem;
    margin: 1.6rem auto 0;

    button {
      padding: 0;
    }
  }

  &-reserve {
    padding: 2rem 2rem 2rem 2.4rem;
    margin-top: 3.2rem;
    border: 1px solid #eeeeee;
    border-radius: 0.4rem;
    background-color: #fafafa;

    &__title {
      padding-bottom: 0.8rem;
      color: #333333;
      font-size: 1.4rem;
      font-family: "Noto Sans KR", sans-self;
      font-weight: bold;
      line-height: 1.5;
      letter-spacing: -0.01rem;
    }

    &__info {
      display: flex;
      color: #666666;
      font-size: 1.2rem;
      font-family: "Noto Sans KR", sans-self;
      font-weight: normal;
      line-height: 1.67;
      letter-spacing: -0.01rem;

      dt {
        margin-right: 1.1rem;
        width: 8rem;
      }

      dd {
        width: 19.1rem;

        em {
          color: #00d664;
          font-family: Volte, sans-serif;
          font-weight: 600;
        }
      }
    }
  }
}
</style>

<style lang="scss">
/deep/ .scroll-top {
  bottom: 8.9rem;
}
</style>
