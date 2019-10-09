<template>
  <div class="bx_select size_m" :class="this.type === 'CART' ? 'w_big' : ''">
    <div class="txt_select" @click.prevent="showOption=!showOption">
      <span class="select_vle">{{couponName}}</span>
      <span class="ico_arrow"></span>
    </div>
    <ul class="lst_select_content" :style="showOption ? 'display: block;' : ''">
      <template v-if="coupons && coupons.length > 0">
        <li>
          <a href="javascript:" @click="selectCoupon(null)">適用しない</a>
        </li>
        <div v-for="(coupon, index) in coupons" :key="index">
          <li :class="couponUsed(coupon) ? 'disabled' : ''">
            <a href="javascript:" @click="selectCoupon(coupon)">{{makeCouponText(coupon)}}</a>
          </li>
        </div>
      </template>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
import { formatCurrency } from '@/utils/StringUtils'
import { mapState } from 'vuex'
// import { getStrYMDHM } from '@/utils/dateUtils'
import ClickOutside from 'vue-click-outside'
import { Alert } from '@/components/common/modal'
import cookies from 'js-cookie'
import { removeCookie, setCookie } from '@/utils/utils'

export default {
  props: ['productNo', 'coupons', 'selectIssueNo', 'selectAmt', 'type'],
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      couponIssueNo: 0,
      couponName: '適用しない',
      showOption: false
    }
  },
  computed: {
    ...mapState('ordersheet', ['couponRequestCopy']),
    // eslint-disable-next-line vue/return-in-computed-property
    couponsTemp () {
      if (this.couponRequestCopy && this.couponRequestCopy.productCoupons) {
        return this.couponRequestCopy.productCoupons.find(item => item.productNo === this.productNo)
      } else {
        return ''
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
        this.couponName = '適用しない'
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
      // const time = getStrYMDHM(new Date(coupon.useEndYmdt.replace(/-/g, '/')))
      const time = coupon.useEndYmdt
      let couponName = coupon.couponName
      if (coupon.limitPayType === 'PAYCO') {
        couponName = '<em class="txt_color_red">' + couponName + '</em>'
      }
      if (coupon.freeDelivery) {
        text = `${formatCurrency(coupon.couponDiscountAmt)}円割引 (${couponName} / 無料 / ${time} まで)`
      } else if (coupon.fixedAmountDiscount) {
        text = `${formatCurrency(coupon.couponDiscountAmt)}円割引 (${couponName} / ${formatCurrency(coupon.couponDiscountAmt)}円 / ${time} まで)`
      } else {
        text = `${formatCurrency(coupon.couponDiscountAmt)}円割引 (${couponName} / ${coupon.discountRate}% (最大 ${formatCurrency(coupon.maxDiscountAmt)}円) / ${time} まで)`
      }
      return text
    },
    selectCoupon (coupon) {
      if (coupon && this.couponUsed(coupon)) {
        if (cookies.get('cartCouponCheck')) {
          Alert({
            message: 'カートクーポンと同時に利用不可能です。'
          })
        } else {
          Alert({
            message: '同じクーポンは利用不可能です。'
          })
        }
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
          setCookie('cartCouponCheck', false)
          if (coupon && !coupon.otherCouponUsable) {
            if (confirm('このクーポンの使用時に商品クーポンは利用できません。このクーポンを使用しますか？')) {
              setCookie('cartCouponCheck', true)
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
            } else {
              couponReq.cartCouponIssueNo = previousCouponIssueNo
              this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
              return
            }
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
        this.couponName = '適用しない'
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
