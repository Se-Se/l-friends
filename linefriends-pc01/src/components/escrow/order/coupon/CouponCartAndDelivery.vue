<template>
  <table class="table_info sp_3">
    <colgroup>
      <col style="width:160px">
      <col style="width:560px">
      <col style="width:120px">
    </colgroup>
    <tbody>
      <tr v-if="cartCoupons.length">
        <th>カートクーポン</th>
        <td>
          <coupon-item :productNo="0" :coupons="cartCoupons" :selectIssueNo="selectIssueNo(cartCoupons)" :selectAmt="selectAmt(cartCoupons)" :type="'CART'" @computePrice="computePrice" />
        </td>
        <td>
          <span class="num txt_color_green">￥ {{cartDiscountAmt | formatCurrency}} </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import CouponItem from '@/components/escrow/order/coupon/CouponItem'

export default {
  props: ['cartCoupons', 'deliveryCoupons', 'display'],
  components: {
    CouponItem
  },
  data () {
    return {
      cartDiscountAmt: 0,
      deliveryDiscountAmt: 0
    }
  },
  methods: {
    computePrice (type, couponDiscountAmt) {
      if (type === 'CART') {
        this.cartDiscountAmt = (couponDiscountAmt === null) ? 0 : couponDiscountAmt
      } else if (type === 'CART_DELIVERY') {
        this.deliveryDiscountAmt = (couponDiscountAmt === null) ? 0 : couponDiscountAmt
      }
    },
    selectIssueNo (coupons) {
      let selectIssueNo = 0
      coupons.forEach(coupon => {
        if (coupon.selected) {
          selectIssueNo = coupon.couponIssueNo
        }
      })
      return selectIssueNo
    },
    selectAmt (coupons) {
      let selectAmt = 0
      coupons.forEach(coupon => {
        if (coupon.selected) {
          selectAmt = coupon.couponDiscountAmt
        }
      })
      return selectAmt
    }
  }
}
</script>
