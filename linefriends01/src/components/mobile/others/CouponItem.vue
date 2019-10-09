<template>
  <div
    class="project-coupon"
    :style="coupon.downloadable ? '' : 'pointer-events: none;'"
    @click.prevent="downloadCoupon(coupon.couponNo)"
  >
    <dl class="project-coupon__item">
      <dt>
        <div class="project-coupon__item-title">
          <p class="project-coupon__item-status">
            {{ coupon.couponName | wordsFormat(14) }}
          </p>
          <p class="project-coupon__item-price">
            <template v-if="coupon.discountInfo.fixedAmt">
              {{ priceFormat(coupon.discountInfo.discountAmt) }}<em>원</em>
            </template>
            <template v-else>
              {{ coupon.discountInfo.discountRate }}<em>%</em>
            </template>
          </p>
        </div>
      </dt>
      <dd :style="coupon.downloadable ? '' : 'background-color: #dcdcdc;'">
        <button>
          <img
            src="~@/assets/images/common/icons/ic-download.svg"
            alt="쿠폰 다운로드"
          >
        </button>
      </dd>
    </dl>
    <div class="project-coupon__info">
      <p class="project-coupon__info-discount">
        <template v-if="!coupon.discountInfo.fixedAmt">
          <template v-if="coupon.couponType === 'CART'">장바구니</template> 최대 {{ priceFormat(coupon.discountInfo.maxDiscountAmt) }}원 할인
        </template>
        <br />
        <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
          {{ priceFormat(coupon.useConstraint.minSalePrice) }}원 이상 ~ {{ priceFormat(coupon.useConstraint.maxSalePrice) }}원 이하 사용 가능
        </template>
        <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
          {{ priceFormat(coupon.useConstraint.minSalePrice) }}원 이상 사용 가능
        </template>
        <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
          {{ priceFormat(coupon.useConstraint.maxSalePrice) }}원 이하 사용 가능
        </template>
      </p>
      <p class="project-coupon__info-date">
        {{ coupon.dateInfo.issueEndYmdt.split(' ')[0].replace(/-/gi,'.') }} 까지 발급 가능
      </p>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { Alert } from '@/utils/event-bus'

export default {
  name: 'CouponItem',
  props: {
    coupon: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('event', ['event'])
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
