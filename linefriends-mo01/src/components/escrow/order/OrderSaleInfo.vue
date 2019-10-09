<template>
  <dd>
    <span class="table-grid__left w-70p pr-7">
      <input type="text" placeholder="" v-model="showTotalDiscountAmt" :readonly="true">
    </span>
    <span class="table-grid__right">
      <button class="btn" @click="showCouponPopup">クーポン適用</button>
    </span>
    <transition name="coupon-page" v-if="coupon">
      <div v-show="couponSelect" ref="couponPage" class="coupon-page">
        <coupon :coupon="coupon.products" @close="couponSelect = false" />
      </div>
    </transition>
  </dd>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import * as $ from 'jquery'
import Coupon from '@/components/escrow/order/Coupon'
import { Alert } from '@/components/common/modal'

const $elem = $('html, body')

export default {
  name: 'OrderSaleInfo',
  props: ['paymentInfo', 'coupon'],
  components: {
    Coupon
  },
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      useAccumulationAmt: 0,
      couponSelect: false
    }
  },
  watch: {
    couponSelect (next) {
      if (next) {
        disablePageScroll(this.$refs.couponPage)
        $elem.css('overflow', 'hidden')
      } else {
        enablePageScroll(this.$refs.couponPage)
        $elem.css('overflow', '')
      }
    }
  },
  computed: {
    ...mapState('ordersheet', ['orderCoupons', 'couponAmt', 'couponRequest']),
    ...mapGetters('ordersheet', ['orderCouponCnt']),
    showTotalDiscountAmt () {
      let totalDiscountAmt = this.paymentInfo.productCouponAmt + this.paymentInfo.cartCouponAmt + this.paymentInfo.deliveryCouponAmt
      return formatCurrency(totalDiscountAmt)
    },
    accumulationAmt () {
      return formatCurrency(this.paymentInfo.accumulationAmt)
    }
  },
  methods: {
    delSeparator () {
      if (this.useAccumulationAmt) {
        this.useAccumulationAmt = this.useAccumulationAmt.replace(/,/g, '')
      }
    },
    changeAccumulationAmt () {
      let reg = new RegExp('^[1-9][0-9]*$')
      if (!reg.test(this.useAccumulationAmt)) {
        this.useAccumulationAmt = 0
      }
      const availableMinAccumulationAmt = this.paymentInfo.availableMinAccumulationAmt
      const availableMaxAccumulationAmt = this.paymentInfo.availableMaxAccumulationAmt
      const accumulationAmt = this.paymentInfo.accumulationAmt
      const minAccumulationLimit = this.paymentInfo.minAccumulationLimit
      const totalStandardAmt = this.paymentInfo.totalStandardAmt
      if (totalStandardAmt < availableMinAccumulationAmt || minAccumulationLimit > availableMaxAccumulationAmt || minAccumulationLimit > accumulationAmt) {
        this.useAccumulationAmt = 0
      } else if (this.useAccumulationAmt > availableMaxAccumulationAmt) {
        this.useAccumulationAmt = availableMaxAccumulationAmt
      }
      this.$emit('changeAccumulationAmt', this.useAccumulationAmt)
      this.useAccumulationAmt = formatCurrency(this.useAccumulationAmt)
    },
    maxAccumulationAmt () {
      const availableMinAccumulationAmt = this.paymentInfo.availableMinAccumulationAmt
      const availableMaxAccumulationAmt = this.paymentInfo.availableMaxAccumulationAmt
      const accumulationAmt = this.paymentInfo.accumulationAmt
      const minAccumulationLimit = this.paymentInfo.minAccumulationLimit
      const totalStandardAmt = this.paymentInfo.totalStandardAmt
      if (this.accumulationAmt === 0) {
        Alert({
          message: '保有ポイントがありません。'
        })
      }
      if (totalStandardAmt < availableMinAccumulationAmt || minAccumulationLimit > availableMaxAccumulationAmt || minAccumulationLimit > accumulationAmt) {
        this.useAccumulationAmt = 0
      } else {
        this.useAccumulationAmt = availableMaxAccumulationAmt
      }
      this.$emit('changeAccumulationAmt', this.useAccumulationAmt)
      this.useAccumulationAmt = formatCurrency(this.useAccumulationAmt)
    },
    showCouponPopup () {
      if (!this.orderCouponCnt) {
        Alert({
          message: '適用可能なクーポンがありません。'
        })
      } else {
        this.useAccumulationAmt = 0
        this.$emit('changeAccumulationAmt', 0)
        this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest })
        this.couponSelect = true
      }
    }
  }
}
</script>
