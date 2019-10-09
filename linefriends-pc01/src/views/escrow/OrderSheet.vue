<template>
  <div id="container" class="order">
    <div class="wrap">
      <div class="order-content_list">
        <h2>注文・決済</h2>
        <div class="bx_tit_step">
          <div class="tit_step">カート</div>
          <div class="tit_step on">注文・決済</div>
          <div class="tit_step">注文完了</div>
        </div>
        <form>
          <fieldset>
            <legend class="blind">注文・決済</legend>
            <div class="table_wrap">
              <table class="table_data item">
                <caption class="blind">注文・決済</caption>
                <colgroup>
                  <col>
                  <col style="width:150px">
                  <col style="width:176px">
                  <col style="width:140px">
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">商品情報</th>
                    <th scope="col">数量</th>
                    <th scope="col">小計(税込)</th>
                    <th scope="col">送料</th>
                  </tr>
                </thead>
                <OrderCart :orderProductOptions="orderProductOptions" />
              </table>
            </div>
          </fieldset>
        </form>
        <div class="order-input cf">
          <OrderShoppingAddressInfo ref="orderDeliveryAddressInfo" v-if="ordersheet" :logined="logined" :orderProductOptions="orderProductOptions" :dTimes="setDeliveryTime" :delivery="deliveryCondition" :address="recentAddresses" :mail="ordersheet.ordererContact" :deliveryConditionNo="deliveryConditionNo" :paymentInfo="ordersheet.paymentInfo" :deliveryStartYmt="setDeliveryStartYmt" @copyOrderer="copyOrderer" @changeAccumulationAmt="changeAccumulationAmt" />
          <order-payments ref="orderPaymentConfirm" v-if="ordersheet" :order="ordersheet" :paymentInfo="ordersheet.paymentInfo" :orderProductOptions="orderProductOptions" :checkState="checkState" @checkAll="checkAll" @payments="payments" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import OrderCart from '@/components/escrow/order/OrderCart'
import OrderShoppingAddressInfo from '@/components/escrow/order/OrderShoppingAddressInfo'
import OrderPayments from '@/components/escrow/order/OrderPayments'
import OrderSheetNew from '@/components/mixins/order/OrderSheetNew.js'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'OrderSheet',
  mixins: [OrderSheetNew],
  components: {
    OrderCart,
    OrderShoppingAddressInfo,
    OrderPayments
  },
  created () {
    // console.log(this.$store.state.ordersheet)
  },
  computed: {
    ...mapGetters('profile', ['isSaleExec']),
    ...mapState('profile', ['profile']),
    deliveryCondition () {
      if(this.$store.state.ordersheet.deliveryConditions) {
        return this.$store.state.ordersheet.deliveryConditions[0]
      }
    },
    deliveryConditionNo () {
      if(this.$store.state.ordersheet.ordersheet.deliveryGroups) {
        return this.$store.state.ordersheet.ordersheet.deliveryGroups[0].deliveryCondition.deliveryConditionNo
      }
    },
    setDeliveryTime () {
      if(this.$store.state.ordersheet.deliveryConditions) {
        // console.log(this.deliveryCondition)
        return this.deliveryCondition.deliveryTimes
      }
    },
    setDeliveryStartYmt () {
      if(this.$store.state.ordersheet.deliveryConditions) {
        return this.$store.state.ordersheet.deliveryConditions[0].deliveryAvailableStartYmd
      }
    }
  }
}
</script>
