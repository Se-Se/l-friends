<template>
  <!-- [D] 장바구니, 배송비 쿠폰 영역 -->
  <table class="table_info sp_3 table-scroll">
    <colgroup>
      <col style="width:350px">
      <col style="width:350px">
      <col style="width:220px">
    </colgroup>
    <tbody>
      <tr v-if="cartCoupons.length">
        <th>장바구니 쿠폰</th>
        <td>
          <coupon-item :productNo="0" :coupons="cartCoupons" :selectIssueNo="selectIssueNo(cartCoupons)" :selectAmt="selectAmt(cartCoupons)" :type="'CART'" @computePrice="computePrice" />
        </td>
        <td class="discount">
          <span class="num txt_color_red">{{cartDiscountAmt | formatNumber}} {{ $t('currency')}}</span>
        </td>
      </tr>
      <tr v-if="deliveryCoupons.length">
        <th>배송비 쿠폰</th>
        <td>
          <coupon-item :productNo="0" :coupons="deliveryCoupons" :selectIssueNo="selectIssueNo(deliveryCoupons)" :selectAmt="selectAmt(deliveryCoupons)" :type="'CART_DELIVERY'" @computePrice="computePrice" />
        </td>
        <td>
          <span class="num txt_color_red">{{deliveryDiscountAmt | formatNumber}} {{ $t('currency')}}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import CouponItem from '@/components/pc/order/coupon/CouponItem'

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

<style lang="scss" scoped>
.discount {
  text-align: center !important;
}
// .table-scroll {
//   display: inline-block;
//   max-height: 400px;
//   overflow-y: scroll;
// }
</style>

