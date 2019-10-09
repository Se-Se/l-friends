<template>
  <modal-layer-popup :visible="active" :no_area_contents="true" layer_class="popup_wrap" popup_size_class="popup_size_6" @close="closeCouponPopup" v-if="couponRequestCopy">
    <h1 class="layer-popup__bold" slot="title">상품 쿠폰 적용</h1>
    <div class="coupon-scroll">
      <coupon-top-btn :couponRequest="couponRequestCopy"/>
      <coupon-info :display="orderCouponDisplayModel" :products="orderCoupons.products" :couponRequest="couponRequestCopy" :cartCoupons="orderCoupons.cartCoupons" :deliveryCoupons="orderCoupons.deliveryCoupons" />
      <coupon-bottom :productAmt="orderCoupons.productCouponDiscountAmt" :cartAmt="orderCoupons.cartCouponDiscountAmt" :deliveryAmt="orderCoupons.deliveryCouponDiscountAmt" />
      <ul class="btn_list">
        <li>
          <button class="btn btn_red" @click.prevent="couponApply" style="margin: 0 auto;">쿠폰적용</button>
        </li>
      </ul>
    </div>
  </modal-layer-popup>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ModalLayerPopup from '@/components/pc/popup/ModalLayerPopupNew'
import CouponTopBtn from '@/components/pc/order/coupon/CouponTopBtn'
import CouponInfo from '@/components/pc/order/coupon/CouponInfo'
import CouponBottom from '@/components/pc/order/coupon/CouponBottom'
import { Alert, Confirm } from '@/utils/event-bus'
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
        if (_this.usePaycoCoupon) {
          // alert('PAYCO 결제 전용 할인 쿠폰 적용완료되었습니다. PAYCO로 결제 진행 됩니다.')
          Alert({
            message: 'PAYCO 결제 전용 할인 쿠폰 적용완료되었습니다. PAYCO로 결제 진행 됩니다.'
          })
          _this.$emit('closeCouponPopup')
        } else {
          _this.$emit('closeCouponPopup')
        }
      })
    }
  }
}
</script>
<style scoped>
.coupon-scroll {
  max-height: 750px;
  overflow-y: scroll;
}
</style>
