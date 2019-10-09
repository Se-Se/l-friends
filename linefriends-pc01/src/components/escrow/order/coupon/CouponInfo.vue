<template>
  <div class="con">
    <table class="table_info sp_3" v-if="showProductInfos">
      <colgroup>
        <col style="width:340px">
        <col style="width:280px">
        <col style="width:120px">
      </colgroup>
      <thead>
      <tr>
        <th>商品情報</th>
        <th>クーポンを選択</th>
        <th>割引金額</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="product in products">
        <coupon-product :product="product" :couponRequest="couponRequest" :key="product.productNo" v-if="haveCoupons(product)" />
      </template>
      </tbody>
    </table>
    <h1 class="mar-top-40">カート/送料クーポンを適用する</h1>
    <div class="mar-top-20">
      <coupon-cart-and-delivery :cartCoupons="commonCartCoupons" :deliveryCoupons="commonDeliveryCoupons" v-if="showCartAndDelivery" />
      <coupon-not-have v-else />
    </div>

  </div>
</template>

<script>
import CouponProduct from '@/components/escrow/order/coupon/CouponProduct'
import CouponCartAndDelivery from '@/components/escrow/order/coupon/CouponCartAndDelivery'
import CouponNotHave from '@/components/escrow/order/coupon/CouponNotHave'

export default {
  props: ['display', 'products', 'couponRequest', 'cartCoupons', 'deliveryCoupons'],
  components: {
    CouponProduct,
    CouponCartAndDelivery,
    CouponNotHave
  },
  data () {
    return {
    }
  },
  computed: {
    commonCartCoupons () {
      if (this.display.hasCommonCartCoupon) {
        return this.cartCoupons
      }
      return []
    },
    commonDeliveryCoupons () {
      if (this.display.hasCommonDeliveryCoupon) {
        return this.deliveryCoupons
      }
      return []
    },
    showProductInfos () {
      let showFlg = false
      this.products.forEach(item => {
        if (!showFlg) {
          if (this.haveCoupons(item)) {
            showFlg = true
          }
        }
      })
      return showFlg
    },
    showCartAndDelivery () {
      return this.commonCartCoupons.length > 0 || this.commonDeliveryCoupons.length > 0
    }
  },
  methods: {
    haveCoupons (item) {
      return item && ((item.productCoupons && item.productCoupons.length) || (item.productPlusCoupons && item.productPlusCoupons.length))
    }
  }
}
</script>
