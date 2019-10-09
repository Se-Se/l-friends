<template>
  <div>
    <div class="coupon-info__row">
      <app-label class="coupon-info__label">
        상품정보
      </app-label>
      <p class="coupon-info__value">
        {{ showBrandName + product.productName | wordsFormat(50) }}
      </p>
    </div>
    <div class="coupon-info__row">
      <app-label class="coupon-info__label">
        쿠폰선택
      </app-label>
      <p class="coupon-info__value">
        <coupon-select
          type="PRODUCT"
          :selectIssueNo="selectIssueNo(product.productCoupons)"
          :selectAmt="selectAmt(product.productCoupons)"
          :coupons="product.productCoupons"
          :productNo="product.productNo"
          @computePrice="computePrice"
        />
      </p>
    </div>
    <dl class="coupon-info__row inline">
      <dt class="coupon-info__label">
        할인금액
      </dt>
      <dd class="coupon-info__value">
        <span class="price">{{ totalProductDiscountAmt | formatNumber }}</span>원
      </dd>
    </dl>
  </div>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'
import { getStrYMDHM } from '@/utils/dateUtils'
import AppLabel from '@/components/mobile/common/form/Label'
import CouponSelect from './CouponSelect'

export default {
  name: 'CouponProduct',
  props: ['product', 'couponRequest'],
  components: {
    AppLabel,
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
