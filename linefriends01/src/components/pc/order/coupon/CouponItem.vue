<template>
  <div class="bx_select" v-click-outside="() => {showOption = false}">
    <a href="javascript:" :class="['txt_select', {'on' : showOption}]" v-toggle="showOption">
      <span v-html="couponName"></span>
      <span class="ico_arrow">목록 열기</span>
    </a>
    <ul class="lst_select_content top_show coupon-overflow">
      <template v-if="coupons && coupons.length > 0">
        <li>
          <a href="javascript:" @click="selectCoupon(null)">적용안함</a>
        </li>
        <template v-for="(coupon, index) in coupons">
          <li :class="couponUsed(coupon) ? 'disabled' : ''">
            <a href="javascript:" @click="selectCoupon(coupon)" v-html="makeCouponText(coupon)"></a>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'
import { mapState } from 'vuex'
import { getStrYMDHM } from '@/utils/dateUtils'
import { Confirm } from '@/utils/event-bus'
import ClickOutside from 'vue-click-outside'
export default {
  props: ['productNo', 'coupons', 'selectIssueNo', 'selectAmt', 'type'],
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      couponIssueNo: 0,
      couponName: '적용안함',
      showOption: false
    }
  },
  computed: {
    ...mapState('ordersheet', ['couponRequestCopy']),
    couponsTemp () {
      if (this.couponRequestCopy && this.couponRequestCopy.productCoupons) {
        return this.couponRequestCopy.productCoupons.find(item => item.productNo === this.productNo)
      }
    },
    ...mapState('ordersheet', ['otherCouponUsable'])
  },
  watch: {
    selectIssueNo () {
      this.setSelected()
    },
    selectAmt () {
      this.setSelected()
    }
  },
  created () {
    this.setSelected()
  },
  methods: {
    setSelected () {
      if (this.selectIssueNo !== 0) {
        this.coupons.forEach(coupon => {
          if (coupon.selected) {
            this.couponName = this.makeCouponText(coupon)
            this.showOption = false
            this.$emit('computePrice', this.type, coupon.couponDiscountAmt)
          }
        })
      } else {
        this.couponName = '적용안함'
        this.showOption = false
        this.$emit('computePrice', this.type, null)
      }
    },
    couponUsed (coupon) {
      if (coupon.used && !coupon.selected) {
        return true
      }

      if (this.type !== 'CART' && this.type !== 'CART_DELIVERY' && !this.otherCouponUsable) {
        return true
      }

      if (this.couponsTemp) {
        if (this.type === 'PRODUCT_PLUS') {
          const plusCoupons = this.couponsTemp.couponPlusDisable.find(item => item.couponIssueNo === coupon.couponIssueNo)
          if (plusCoupons) {
            return plusCoupons.disable
          }
        } else if (this.type === 'PRODUCT') {
          const coupons = this.couponsTemp.couponDisable.find(item => item.couponIssueNo === coupon.couponIssueNo)
          if (coupons) {
            return coupons.disable
          }
        }
      }
      return false
    },
    makeCouponText (coupon) {
      let text = ''
      const time = getStrYMDHM(new Date(coupon.useEndYmdt.replace(/-/g, '/')))
      let couponName = coupon.couponName
      if (coupon.limitPayType === 'PAYCO') {
        couponName = '<em class="txt_color_red">' + couponName + '</em>'
      }
      if (coupon.freeDelivery) {
        text = `${formatCurrency(coupon.couponDiscountAmt)}원 할인 (${couponName} / 무료 / ${time} 까지)`
      } else if (coupon.fixedAmountDiscount) {
        text = `${formatCurrency(coupon.couponDiscountAmt)}원 할인 (${couponName} / ${formatCurrency(coupon.couponDiscountAmt)}원 / ${time} 까지)`
      } else {
        text = `${formatCurrency(coupon.couponDiscountAmt)}원 할인 (${couponName} / ${coupon.discountRate}% (최대 ${formatCurrency(coupon.maxDiscountAmt)}원) / ${time} 까지)`
      }
      return text
    },
    selectCoupon (coupon) {
      if (coupon && this.couponUsed(coupon)) {
        return false
      }
      let previousCouponIssueNo = this.couponRequestCopy.cartCouponIssueNo
      this.couponIssueNo = coupon ? coupon.couponIssueNo : 0

      const couponReq = JSON.parse(JSON.stringify(this.couponRequestCopy))
      switch (this.type) {
        case 'PRODUCT':
          this.$store.commit('ordersheet/SET_COUPONREQUEST_COUPONISS', { productNo: this.productNo, couponIssueNo: this.couponIssueNo, isCopy: true })
          break
        case 'PRODUCT_PLUS':
          this.$store.commit('ordersheet/SET_COUPONREQUEST_PLUSCOUPONISS', { productNo: this.productNo, plusCouponIssueNo: this.couponIssueNo, isCopy: true })
          break
        case 'CART':
          if (coupon && !coupon.otherCouponUsable) {
            Confirm({
              message: '이 쿠폰 사용 시 상품쿠폰은 사용할 수 없습니다. 이 쿠폰을 사용하시겠습니까?',
              callback: () => {
                couponReq.productCoupons.forEach((item) => {
                  item.couponIssueNo = 0
                  item.plusCouponIssueNo = 0
                  item.couponDisable.forEach(si => {
                    si.usable = false
                    si.disable = false
                  })
                  item.couponPlusDisable.forEach(si => {
                    si.usable = false
                    si.disable = false
                  })
                })
                couponReq.cartCouponIssueNo = this.couponIssueNo
                this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
                this.$store.commit('ordersheet/CHANGE_OTHER_COUPON_USABLE', coupon.otherCouponUsable)
              },
              onCancel: () => {
                couponReq.cartCouponIssueNo = previousCouponIssueNo
                this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
                return true
              }
            })
            // if (confirm('이 쿠폰 사용 시 상품쿠폰은 사용할 수 없습니다. 이 쿠폰을 사용하시겠습니까?')) {
            //   couponReq.productCoupons.forEach((item) => {
            //     item.couponIssueNo = 0
            //     item.plusCouponIssueNo = 0
            //     item.couponDisable.forEach(si => {
            //       si.usable = false
            //       si.disable = false
            //     })
            //     item.couponPlusDisable.forEach(si => {
            //       si.usable = false
            //       si.disable = false
            //     })
            //   })
            //   couponReq.cartCouponIssueNo = this.couponIssueNo
            //   this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
            //   this.$store.commit('ordersheet/CHANGE_OTHER_COUPON_USABLE', coupon.otherCouponUsable)
            // } else {
            //   couponReq.cartCouponIssueNo = previousCouponIssueNo
            //   this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
            //   return
            // }
          } else {
            let otherCouponUsable = coupon ? coupon.otherCouponUsable : true
            couponReq.cartCouponIssueNo = this.couponIssueNo
            this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
            this.$store.commit('ordersheet/CHANGE_OTHER_COUPON_USABLE', otherCouponUsable)
          }
          break
        case 'CART_DELIVERY':
          couponReq.deliveryCouponIssueNo = this.couponIssueNo
          this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
          break
      }
      this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequestCopy })
      if (coupon) {
        this.couponName = this.makeCouponText(coupon)
      } else {
        this.couponName = '적용안함'
      }
      this.showOption = false
      coupon ? this.$emit('computePrice', this.type, coupon.couponDiscountAmt) : this.$emit('computePrice', this.type, coupon)
    }
  },
  directives: {
    ClickOutside
  }
}
</script>
<style>
.lst_select_content.top_show {
  z-index: 9999;
}
</style>

