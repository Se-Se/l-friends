<template>
    <div class="coupon-popup" style="display: block;">
        <p class="coupon-popup-close"><a href="#" @click="closeCouponPopup">close</a></p>
        <div class="coupon-popup-ttl">クーポン適用</div>
        <div class="coupon-popup-contents">
            <div class="coupon-ttl">
                <span class="ttl_style">商品割引クーポンを適用する</span>
                <span class="coupon-icon order_03_coupon_style" @click.prevent="toggleMax">{{ resetBtnFlg ? '最大割引解除' : '最大割引適用' }}</span>
            </div>
            <div v-if="showProductInfos"></div>
            <div v-if="this.coupon">
            <div v-for="(product, key) in this.coupon" :key="key">
                <coupon-product :product="product" :coupon-request="couponRequestCopy" />
            </div>
            </div>
        </div>
        <div class="coupon-popup-contents" v-if="showCartAndDelivery">
            <coupon-cart-and-delivery
                    :cartCoupons="commonCartCoupons"
                    :deliveryCoupons="commonDeliveryCoupons"
            />
            <!--<p class="coupon-ttl m_t_3">カート/送料クーポンを適用する</p>-->
            <!--<p class="item-info-detail cart_item_position">カートクーポン</p>-->
            <!--<dl class="input_box">-->
                <!--<dt>クーポンを選択</dt>-->
                <!--<dd>-->
                    <!--<div class="bx_select">-->
                        <!--<select class="normal-sel">-->
                            <!--<option>適用しない</option>-->
                            <!--<option>適用しない</option>-->
                            <!--<option>適用しない</option>-->
                            <!--<option>適用しない</option>-->
                            <!--<option>適用しない</option>-->
                        <!--</select>-->
                    <!--</div>-->
                <!--</dd>-->
            <!--</dl>-->
            <!--<dl class="off-prize">-->
                <!--<dt>割引金額</dt>-->
                <!--<dd><span class="number style-volte"><span>￥</span>0</span></dd>-->
            <!--</dl>-->
        </div>
        <div class="coupon-popup-contents nodata" v-else>
            <p class="coupon-ttl m_t_3">カート/送料クーポンを適用する</p>
            <p class="txt_ex m_t_b_10">適用可能なクーポンがありません.</p>
        </div>
        <div class="coupon-popup-contents">
            <div class="settlement-area">
                <dl class="settlement">
                    <dt>商品割引金額</dt>
                    <dd class="style-volte f1_8"><span>￥</span>{{ productAmt }}</dd>
                </dl>
                <dl class="settlement">
                    <dt>カート割引金額</dt>
                    <dd><span class="number style-volte f1_8"><span>￥</span>{{ cartAmt }}</span></dd>
                </dl>
                <dl class="settlement">
                    <dt>送料割引金額</dt>
                    <dd><span class="number style-volte f1_8"><span>￥</span>{{ deliveryAmt }}</span></dd>
                </dl>
                <dl class="settlement total">
                    <dt>総割引金額</dt>
                    <dd><span class="number style-volte"><span>￥</span>{{ totalAmt }}</span></dd>
                </dl>
                <div class="settlement-btn"><button class="btn btn_green" @click="couponApply">確認</button></div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapGetters } from 'vuex'
import CouponProduct from '@/components/escrow/order/CouponProduct'
import CouponCartAndDelivery from '@/components/escrow/order/CouponCartAndDelivery'

export default {
  name: 'Coupon',
  props: ['coupon'],
  components: {
    CouponProduct,
    CouponCartAndDelivery
  },
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo
    }
  },
  created () {
      // console.log(this.coupon)
      //   console.log(this.orderCoupons)
  },
  computed: {
    ...mapGetters('ordersheet', ['orderCouponDisplayModel']),
    ...mapState('ordersheet', ['orderCoupons']),
    ...mapState('ordersheet', ['couponRequestCopy', 'usePaycoCoupon']),
    ...mapGetters('ordersheet', ['resetBtnFlg']),
    display () {
      return this.orderCouponDisplayModel || {}
    },
    commonCartCoupons () {
      if (this.display.hasCommonCartCoupon) {
        return this.orderCoupons.cartCoupons
      }
      return []
    },
    commonDeliveryCoupons () {
      if (this.display.hasCommonDeliveryCoupon) {
        return this.orderCoupons.deliveryCoupons
      }
      return []
    },
    showProductInfos () {
      let showFlg = false
      if (this.orderCoupons) {
        this.orderCoupons.products.forEach(item => {
          if (!showFlg) {
            if (this.haveCoupons(item)) {
              showFlg = true
            }
          }
        })
      }
      return showFlg
    },
    showCartAndDelivery () {
      return this.commonCartCoupons.length > 0 || this.commonDeliveryCoupons.length > 0
    },
    productAmt () {
      return this.orderCoupons ? this.orderCoupons.productCouponDiscountAmt : 0
    },
    cartAmt () {
      return this.orderCoupons ? this.orderCoupons.cartCouponDiscountAmt : 0
    },
    deliveryAmt () {
      return this.orderCoupons ? this.orderCoupons.deliveryCouponDiscountAmt : 0
    },
    totalAmt () {
      return this.productAmt + this.cartAmt + this.deliveryAmt
    },
  },
  methods: {
    toggleMax () {
      if (this.resetBtnFlg) {
        this.$store.dispatch('ordersheet/resetConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequestCopy })
      } else {
        this.$store.dispatch('ordersheet/maxCalculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequestCopy })
      }
    },
    showBrandName (product) {
      if (product.brandName) {
        product.brandName = '[' + product.brandName + ']'
      }
      return product.brandName
    },
    haveCoupons (item) {
      return item && ((item.productCoupons && item.productCoupons.length) || (item.productPlusCoupons && item.productPlusCoupons.length))
    },
    closeCouponPopup () {
      this.$store.commit('ordersheet/COPY_COUPONREQUEST')
      this.$emit('close')
    },
    couponApply () {
      const _this = this
      this.$store.dispatch('ordersheet/applyCouponOrder', { orderSheetNo: this.orderSheetNo }).then(() => {
        _this.$store.commit('ordersheet/CHANGE_COUPONREQUEST')
        _this.$store.commit('ordersheet/COPY_COUPONREQUEST')
        _this.$store.commit('ordersheet/SET_USE_PAYCOCOUPON')
        _this.$emit('close')
      })
    }
  }
}
</script>
