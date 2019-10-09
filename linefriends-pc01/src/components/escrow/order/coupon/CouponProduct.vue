<template>
  <tr>
    <td>
      <p class="max_line2">{{showBrandName + product.productName}}</p>
    </td>
    <td>
      <coupon-item v-if="product.productCoupons && product.productCoupons.length" :productNo="product.productNo" :coupons="product.productCoupons" :selectIssueNo="selectIssueNo(product.productCoupons)" :selectAmt="selectAmt(product.productCoupons)" :type="'PRODUCT'" :couponRequest='couponRequest' @computePrice="computePrice" />
      <coupon-item v-if="product.productPlusCoupons && product.productPlusCoupons.length" :productNo="product.productNo" :coupons="product.productPlusCoupons" :selectIssueNo="selectIssueNo(product.productPlusCoupons)" :selectAmt="selectAmt(product.productPlusCoupons)" :type="'PRODUCT_PLUS'" :couponRequest='couponRequest' @computePrice="computePrice" />
    </td>
    <td>
      <span class="num txt_color_green">￥ {{totalProductDiscountAmt}}</span>
    </td>
  </tr>
</template>

<script>
import CouponItem from '@/components/escrow/order/coupon/CouponItem'

export default {
  props: ['product', 'couponRequest'],
  data () {
    return {
      productDiscountAmt: 0,
      productPlusDiscountAmt: 0
    }
  },
  components: {
    CouponItem
  },
  computed: {
    productCoupon () {
      return this.couponRequest.productCoupons.filter(coupon => coupon.productNo === this.product.productNo)
    },
    totalProductDiscountAmt () {
      return this.productDiscountAmt + this.productPlusDiscountAmt
    },
    showBrandName () {
      return (this.product.brandName) ? `[${this.product.brandName}]` : ''
    }
  },
  methods: {
    computePrice (type, couponDiscountAmt) {
      if (type === 'PRODUCT') {
        this.productDiscountAmt = couponDiscountAmt
      } else if (type === 'PRODUCT_PLUS') {
        this.productPlusDiscountAmt = couponDiscountAmt
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
