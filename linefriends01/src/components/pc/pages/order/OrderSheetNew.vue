<template>
  <div id="container" class="payco">
    <div class="escrow" v-if="ordersheet">
      <div class="escrow_inner">
        <!-- order-sheet header component S-->
        <EscrowHeaderNew page="orderSheet" />
        <!-- order-sheet header component E -->
        <form>
          <fieldset>
            <legend class="blind">장바구니 목록</legend>
            <OrderTableNew :orderProductOptions="orderProductOptions" />
          </fieldset>
        </form>
        <div class="table-grid pad_top_40">
          <div class="table-grid__left width-800" id="area_order_information">
            <!-- <OrderOrdererInfoNew ref="orderOrdererInfo" :logined="logined" :orderer="ordersheet.ordererContact" /> -->
            <OrderDeliveryAddressInfoNew ref="orderDeliveryAddressInfo" :logined="logined" :address="recentAddresses" :requireCustomsIdNumber="ordersheet.requireCustomsIdNumber" @copyOrderer="copyOrderer" @changeAccumulationAmt="changeAccumulationAmt" />
            <OrderCouponApplyNew ref="orderCouponApplyNew" :paymentInfo="ordersheet.paymentInfo" @changeAccumulationAmt="changeAccumulationAmt"/>
          </div>
          <OrderPaymentConfirmNew ref="orderPaymentConfirm" :order="ordersheet" :orderProductOptions="orderProductOptions" :checkState="checkState" @checkAll="checkAll" @payments="payments" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EscrowHeaderNew from '@/components/pc/layout/header/EscrowHeaderNew'
import OrderTableNew from '@/components/pc/order/OrderTableNew'
import OrderOrdererInfoNew from '@/components/pc/order/OrderOrdererInfoNew'
import OrderDeliveryAddressInfoNew from '@/components/pc/order/OrderDeliveryAddressInfoNew'
import OrderCouponApplyNew from '@/components/pc/order/OrderCouponApplyNew'
import OrderPaymentConfirmNew from '@/components/pc/order/OrderPaymentConfirmNew'
import OrderAgreement from '@/components/pc/order/OrderAgreement'
import OrderSheetNew from '@/components/mixins/order/OrderSheetNew.js'

export default {
  name: 'OrderSheet',
  mixins: [OrderSheetNew],
  components: {
    EscrowHeaderNew,
    OrderTableNew,
    OrderOrdererInfoNew,
    OrderDeliveryAddressInfoNew,
    OrderCouponApplyNew,
    OrderPaymentConfirmNew,
    OrderAgreement
  }
}
</script>

<style lang="scss">
#wrap.pc #container.payco {
  padding-top: 161px;

  @import '~@/styles/pc/payco/index.scss';
}
</style>
