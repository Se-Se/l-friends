<template>
  <app-select v-model="selectedCoupon" @change="onSelect" ref="couponSelect" :options="[
      {
        label: '適用しない',
        value: null
      },
      ...coupons.map(item => ({
        label: makeCouponText(item),
        value: item
      }))
    ]" />
</template>

<script>
/* eslint-disable */
import AppSelect from '@/components/escrow/order/Select'
import { Confirm, Alert } from '@/components/common/modal'
import { mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import cookies from 'js-cookie'
import { removeCookie, setCookie } from '@/utils/utils'

export default {
  name: 'CouponSelect',
  props: ['productNo', 'coupons', 'selectIssueNo', 'selectAmt', 'type'],
  components: {
    AppSelect
  },
  watch: {
    selectIssueNo () {
      this.setSelected()
    },
    selectAmt () {
      this.setSelected()
    }
  },
  computed: {
    ...mapState('ordersheet', ['couponRequestCopy', 'otherCouponUsable']),
    couponsTemp () {
      if (this.couponRequestCopy && this.couponRequestCopy.productCoupons) {
        return this.couponRequestCopy.productCoupons.find(item => item.productNo === this.productNo)
      }
    }
  },
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      selectedCoupon: null
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
            this.selectedCoupon = coupon
            this.$emit('computePrice', this.type, coupon.couponDiscountAmt)
          }
        })
      } else {
        this.selectedCoupon = null
        this.$emit('computePrice', this.type, null)
      }
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
    couponUsed (coupon) {
      if (coupon.used && !coupon.selected) {
        this.selectedCoupon = null
        this.$emit('computePrice', this.type, null)
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
    onSelect () {
      const coupon = this.selectedCoupon
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
        this.selectedCoupon = null
        this.$emit('computePrice', this.type, null)
        this.$refs.couponSelect.select = null
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
            Confirm('このクーポンの使用時に商品クーポンは利用できません。このクーポンを使用しますか？').then(res => {
              if (res) {
                setCookie('cartCouponCheck', true)
                // couponReq.productCoupons.forEach((item) => {
                //   item.couponIssueNo = 0
                //   item.plusCouponIssueNo = 0
                //   item.couponDisable.forEach(si => {
                //     si.usable = false
                //     si.disable = false
                //   })
                //   item.couponPlusDisable.forEach(si => {
                //     si.usable = false
                //     si.disable = false
                //   })
                // })
                this.$store.commit('ordersheet/SET_COUPONREQUEST_COUPONISS', { productNo: this.productNo, couponIssueNo: 0, isCopy: true })
                let otherCouponUsable = coupon ? coupon.otherCouponUsable : true
                couponReq.cartCouponIssueNo = this.couponIssueNo
                this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
                // this.$store.commit('ordersheet/CHANGE_OTHER_COUPON_USABLE', coupon.otherCouponUsable)
                this.$store.commit('ordersheet/CHANGE_OTHER_COUPON_USABLE', otherCouponUsable)
                this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequestCopy })
              } else {
                couponReq.cartCouponIssueNo = previousCouponIssueNo
                this.$store.commit('ordersheet/SET_COUPONREQUEST_COPY', couponReq)
                this.selectedCoupon = null
                this.onSelect()
              }
            })
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
        // this.couponName = coupon.displayCouponName
        this.couponName = coupon.couponDiscountAmt+'円割引 ('+coupon.couponName+' / '+ coupon.couponDiscountAmt + '円 / ' + coupon.useEndYmdt + ' まで)'
      } else {
        this.couponName = '設定しない'
      }
      this.showOption = false
      coupon ? this.$emit('computePrice', this.type, coupon.couponDiscountAmt) : this.$emit('computePrice', this.type, coupon)
    }
  }
}
</script>
