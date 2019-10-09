<template>
    <modal-layer-popup :visible="active" :no_area_contents="true" layer_class="popup_wrap" popup_size_class="popup_size_6" @close="closeCouponPopup" v-if="couponRequestCopy">
<div class="popup-layer">
    <div class="popup_common popup_size_3">
        <div class="roller_area">
            <h1>商品割引クーポンを適用する</h1>
            <coupon-top-btn :couponRequest="couponRequestCopy"/>
            <coupon-info :display="orderCouponDisplayModel" :products="orderCoupons.products" :couponRequest="couponRequestCopy" :cartCoupons="orderCoupons.cartCoupons" :deliveryCoupons="orderCoupons.deliveryCoupons" />
            <coupon-bottom :productAmt="orderCoupons.productCouponDiscountAmt" :cartAmt="orderCoupons.cartCouponDiscountAmt" :deliveryAmt="orderCoupons.deliveryCouponDiscountAmt" />
            <ul class="btn_list">
                <li>
                    <button class="btn btn_green" @click.prevent="couponApply">確認</button>
                </li>
            </ul>
        </div>
        <button class="btn_close" @click.prevent="closeCouponPopup">close</button>
    </div>
</div>
    </modal-layer-popup>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ModalLayerPopup from '@/components/popup/ModalLayerPopup'
import CouponTopBtn from '@/components/escrow/order/coupon/CouponTopBtn'
import CouponInfo from '@/components/escrow/order/coupon/CouponInfo'
import CouponBottom from '@/components/escrow/order/coupon/CouponBottom'
import $ from 'jquery'

export default {
  props: ['orderCoupons', 'active'],
  components: {
    ModalLayerPopup,
    CouponTopBtn,
    CouponInfo,
    CouponBottom
  },
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo
    }
  },
  computed: {
    ...mapState('ordersheet', ['couponRequestCopy', 'usePaycoCoupon']),
    ...mapGetters('ordersheet', ['orderCouponDisplayModel'])
  },
  methods: {
    closeCouponPopup () {
      this.$store.commit('ordersheet/COPY_COUPONREQUEST')
      this.$emit('closeCouponPopup')
    },
    couponApply () {
      const _this = this
      $('html').css('overflow', 'scroll')
      this.$store.dispatch('ordersheet/applyCouponOrder', { orderSheetNo: this.orderSheetNo }).then(() => {
        _this.$store.commit('ordersheet/CHANGE_COUPONREQUEST')
        _this.$store.commit('ordersheet/COPY_COUPONREQUEST')
        _this.$store.commit('ordersheet/SET_USE_PAYCOCOUPON')
      })
      this.$emit('closeCouponPopup')
    }
  }
}
</script>
