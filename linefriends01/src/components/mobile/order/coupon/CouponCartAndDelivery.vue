<template>
  <div>
    <div class="coupon-info__row" v-if="cartCoupons.length"> 
      <app-label class="coupon-info__label">
        장바구니 쿠폰
      </app-label>
      <p class="coupon-info__value">
        <coupon-select
          type="CART"
          :productNo="0"
          :selectIssueNo="selectIssueNo(cartCoupons)"
          :selectAmt="selectAmt(cartCoupons)"
          :coupons="cartCoupons"
          @computePrice="computePrice"
        />
      </p>
    </div>
    <dl class="coupon-info__row inline">
      <dt class="coupon-info__label">
        할인금액
      </dt>
      <dd class="coupon-info__value">
        <span class="price">{{ cartDiscountAmt | formatNumber }}</span>원
      </dd>
    </dl>
    <div class="coupon-info__row" v-if="deliveryCoupons.length">
      <app-label class="coupon-info__label">
        배송비 쿠폰
      </app-label>
      <p class="coupon-info__value">
        <coupon-select
          type="CART_DELIVERY"
          :productNo="0"
          :selectIssueNo="selectIssueNo(deliveryCoupons)"
          :selectAmt="selectAmt(deliveryCoupons)"
          :coupons="deliveryCoupons"
          @computePrice="computePrice"
        />
      </p>
    </div>
    <dl class="coupon-info__row inline">
      <dt class="coupon-info__label">
        할인금액
      </dt>
      <dd class="coupon-info__value">
        <span class="price">{{ deliveryDiscountAmt | formatNumber }}</span>원
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
  name: 'CouponCartAndDelivery',
  props: ['cartCoupons', 'deliveryCoupons'],
  components: {
    AppLabel,
    CouponSelect
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
