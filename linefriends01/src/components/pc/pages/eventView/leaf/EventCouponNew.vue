<template>
  <div class="mian_coupon" id="main_coupon_id" v-if="event && event.coupon && event.coupon.coupons.length > 0">
    <div class="bx_coupon_tit">
      <span class="tit">쿠폰 혜택</span>
      <div class="text">
        <span>쿠폰 안내</span>
        <div class="dsc_info_layer__box" v-if="event && event.coupon && event.coupon.guideImageUrl" v-html="event.coupon.guideImageUrl">
        </div>
      </div>
    </div>
    <div class="bx_coupon_big inner">
      <div class="bx_coupon_con" v-for="coupon in event.coupon.coupons">
        <a href="javascript:void(0)"  @click.prevent="downloadCoupon(coupon.couponNo)" :class="{ disabled: coupon.downloadable === false, percent: coupon.discountInfo.fixedAmt === false}">
          <strong class="tit">{{ coupon.couponName | wordsFormat(14) }}</strong>
          <span class="bx_price">
            <template v-if="coupon.discountInfo.fixedAmt">
              <strong class="number">{{ priceFormat(coupon.discountInfo.discountAmt) }}<span class="txt money">원</span></strong>
            </template>
            <template v-else>
              <strong class="number">{{ coupon.discountInfo.discountRate }}<span class="txt percent">%</span></strong>
            </template>
          </span>
          <span class="ico_download test">
            <span class="sp">쿠폰 다운로드</span>
          </span>
        </a>
        <div class="dsc_info">
          <template v-if="!coupon.discountInfo.fixedAmt">
            <span :class="{ discount: coupon.useConstraint.minSalePrice, ticket: !coupon.useConstraint.minSalePrice }"><template v-if="coupon.couponType === 'CART'">장바구니 </template>최대 {{ priceFormat(coupon.discountInfo.maxDiscountAmt) }}원 할인</span>
          </template>
          <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
            <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}원 이상 ~ {{ priceFormat(coupon.useConstraint.maxSalePrice) }}원 이하 사용 가능</span>
          </template>
          <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
            <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}원 이상 사용 가능</span>
          </template>
          <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
            <span class="ticket">{{ priceFormat(coupon.useConstraint.maxSalePrice) }}원 이하 사용 가능</span>
          </template>
          <span class="limit">{{ coupon.dateInfo.issueEndYmdt.split(' ')[0].replace(/-/gi,'.') }} 까지 발급 가능</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  data () {
    return {}
  },
  props: {
    product: {
      type: [Object, Array]
    }
  },
  components: {},
  computed: {
    ...mapState('event', ['event']),
    replaceImageUrl () {
      let r = this.event.coupon.guideImageUrl
      r = r.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      return r
    }
  },
  methods: {
    priceFormat (price) {
      return formatCurrency(price)
    },
    downloadCoupon (couponNo) {
      let now = new Date()
      let startDate = new Date(this.event.startYmdt.replace(' ', 'T'))
      let endDate = new Date(this.event.endYmdt.replace(' ', 'T'))
      if (startDate > now) {
        // alert('쿠폰 다운로드 기간이 아닙니다.')
        Alert({
          message: '쿠폰 다운로드 기간이 아닙니다.'
        })
        return
      }
      if (endDate < now) {
        // alert('종료된 프로모션입니다.')
        Alert({
          message: '종료된 프로모션입니다.'
        })
        return
      }
      if (!this.$store.getters.isLogined) {
        this.$store.state.route.query.redirect = `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
        this.$store.dispatch('login')
      } else {
        let _this = this
        this.$store.dispatch('coupon/downLoadCoupons', couponNo).then(() => {
          // alert('할인쿠폰이 발급되었습니다.')
          Alert({
            message: '할인쿠폰이 발급되었습니다.'
          })
          _this.$store.dispatch('event/fetchEventDetail', { eventNo: this.$route.params.eventNo, isMain: true })
        })
      }
    }
  }
}
</script>
<style scoped>
div.dsc_info span.ticket {
  display: block;
}
</style>
