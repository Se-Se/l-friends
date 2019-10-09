<template>
  <app-select
    v-model="selectedCoupon"
    @change="onSelect"
    :options="[
      {
        label: '적용안함',
        value: null
      },
      ...coupons.map(item => ({
        label: item.displayCouponName,
        value: item,
        disabled: couponUsed(item)
      }))
    ]"
  />
</template>

<script>
import AppSelect from '@/components/mobile/common/input/Select'
import { Confirm } from '@/utils/event-bus'
import { mapState } from 'vuex'

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
    onSelect () {
      const coupon = this.selectedCoupon
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
        this.couponName = coupon.displayCouponName
      } else {
        this.couponName = '적용안함'
      }
      this.showOption = false
      coupon ? this.$emit('computePrice', this.type, coupon.couponDiscountAmt) : this.$emit('computePrice', this.type, coupon)
    }
  }
}
</script>
