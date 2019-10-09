<template>
    <div>
    <div class="item-info">
        <p class="item-info-ttl">商品情報</p>
        <p class="item-info-detail">{{ showBrandName + product.productName | wordsFormat(50) }}</p>
    </div>
    <dl class="input_box">
        <dt>クーポンを選択</dt>
        <dd>
            <div class="bx_select">
                <coupon-select
                        v-if="product.productCoupons && product.productCoupons.length"
                        type="PRODUCT"
                        :selectIssueNo="selectIssueNo(product.productCoupons)"
                        :selectAmt="selectAmt(product.productCoupons)"
                        :coupons="product.productCoupons"
                        :productNo="product.productNo"
                        @computePrice="computePrice"
                />
            </div>
        </dd>
    </dl>
    <dl class="off-prize">
        <dt>割引金額</dt>
        <dd><span class="number style-volte"><span>￥</span>{{ totalProductDiscountAmt }}</span></dd>
    </dl>
    </div>
</template>

<script>
/* eslint-disable */
import CouponSelect from '@/components/escrow/order/CouponSelect'

export default {
  name: 'CouponProduct',
  props: ['product', 'couponRequest'],
  components: {
    CouponSelect
  },
  data () {
    return {
      productDiscountAmt: 0,
      productPlusDiscountAmt: 0
    }
  },
  computed: {
    totalProductDiscountAmt () {
      return this.productDiscountAmt + this.productPlusDiscountAmt
    },
    showBrandName () {
      if (this.product.brandName) {
        this.product.brandName = '[' + this.product.brandName + ']'
      }
      return this.product.brandName
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
