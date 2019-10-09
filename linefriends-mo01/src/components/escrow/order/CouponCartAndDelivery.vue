<template>
  <div>
    <p class="coupon-ttl m_t_3">カート/送料クーポンを適用する</p>
    <p class="item-info-detail cart_item_position">カートクーポン</p>
    <dl class="input_box">
      <dt>クーポンを選択</dt>
      <dd>
        <div class="bx_select">
          <coupon-select
                  type="CART"
                  :productNo="0"
                  :selectIssueNo="selectIssueNo(cartCoupons)"
                  :selectAmt="selectAmt(cartCoupons)"
                  :coupons="cartCoupons"
                  @computePrice="computePrice"
          />
        </div>
      </dd>
    </dl>
    <dl class="off-prize">
      <dt>割引金額</dt>
      <dd><span class="number style-volte"><span>￥</span>{{ cartDiscountAmt }}</span></dd>
    </dl>
  </div>
</template>

<script>
import CouponSelect from './CouponSelect'

export default {
  name: 'CouponCartAndDelivery',
  props: ['cartCoupons', 'deliveryCoupons'],
  components: {
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
