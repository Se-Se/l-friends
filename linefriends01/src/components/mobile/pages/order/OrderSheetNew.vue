<template>
  <div>
    <sub-page-header title="주문 결제" />
    <div id="container">
      <ul class="order-menu">
        <li
          v-if="orderProductOptions"
          class="order-menu__item"
        >
          <expand-menu
            label="주문상품"
            size="size"
            opened
            :count="orderProductOptions.length"
          >
            <div class="goods-info order-content">
              <order-container :goods="orderProductOptions" />
            </div>
          </expand-menu>
        </li>
        <!--li
          v-if="ordersheet"
          class="order-menu__item"
        >
          <expand-menu
            label="고객 정보"
            size="size"
            opened
          >
            <orderer-info
              ref="orderOrdererInfo"
              :orderer="ordersheet.ordererContact"
            />
          </expand-menu>
        </li-->
        <li class="order-menu__item">
          <expand-menu
            label="배송 정보"
            size="size"
            opened
          >
            <order-delivery-info
              ref="orderDeliveryAddressInfo"
              :address="recentAddresses"
              :defaultAdd="defaultAdd"
            />
          </expand-menu>
        </li>
        <li class="order-menu__item">
          <expand-menu
            :label="'할인' + (isExec ? ' 및 임직원 포인트' : '')"
            size="size"
            opened
          >
            <order-sale-info
              v-if="ordersheet"
              :payment-info="ordersheet.paymentInfo"
              ref="orderCouponApplyNew"
              @changeAccumulationAmt="changeAccumulationAmt"
            />
          </expand-menu>
        </li>
        <li class="order-menu__item">
          <expand-menu
            label="최종 결제정보"
            size="size"
            opened
          >
            <order-payment-confirm
              ref="orderPaymentConfirmNew" 
              :order="ordersheet"
              @payments="setPayment"
            />
          </expand-menu>
        </li>
      </ul>
      <div class="order-footer">
        <order-confirm
          :order="ordersheet"
          ref="orderPaymentConfirm"
          @open="({ type, order }) => $refs.privacyUsageAgreement.show(type, order)"
        />

        <template v-if="ordersheet">
          <app-button
            v-if="ordersheet.paymentInfo.paymentAmt > 0"
            class="order-submit-btn"
            type="success"
            @click="payments(pgTypeTo, payTypeTo)"
          >
            {{ ordersheet.paymentInfo.paymentAmt | formatCurrency }}원 결제하기
          </app-button>
          <app-button
            v-else
            class="order-submit-btn"
            type="success"
            @click="payments('INICIS', 'ACCUMULATION')"
          >
            결제하기
          </app-button>
        </template>
      </div>
    </div>
    <privacy-usage-agreement ref="privacyUsageAgreement" />
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import ExpandMenu from '@/components/mobile/common/list/ExpandMenu'
import OrderContainer from '@/components/mobile/order/OrderContainer'
import OrdererInfo from '@/components/mobile/order/OrdererInfo'
import OrderDeliveryInfo from '@/components/mobile/order/OrderDeliveryInfo'
import OrderSaleInfo from '@/components/mobile/order/OrderSaleInfo'
import OrderPaymentConfirm from '@/components/mobile/order/OrderPaymentConfirm'
import OrderConfirm from '@/components/mobile/order/OrderConfirm'
import PrivacyUsageAgreement from '@/components/mobile/order/PrivacyUsageAgreement'
import AppButton from '@/components/mobile/common/button/Button'
import OrderSheetNew from '@/components/mixins/order/OrderSheetNew.js'

export default {
  name: 'OrderSheetNew',
  mixins: [OrderSheetNew],
  components: {
    SubPageHeader,
    OrderContainer,
    OrdererInfo,
    OrderDeliveryInfo,
    OrderSaleInfo,
    OrderPaymentConfirm,
    OrderConfirm,
    ExpandMenu,
    AppButton,
    PrivacyUsageAgreement
  },
  data () {
    return {
      pgTypeTo: 'INICIS',
      payTypeTo: 'CREDIT_CARD'
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs.privacyUsageAgreement.active === true) {
      this.$refs.privacyUsageAgreement.close()
      next(false)
    } else {
      next()
    }
  },
  methods: {
    setPayment (payment) {
      this.pgTypeTo = payment.pgType
      this.payTypeTo = payment.payType
    },
    changeAccumulationAmt (accumulationAmt) {
      this.$refs.orderCouponApplyNew.useAccumulationAmt = accumulationAmt
      this.$refs.orderPaymentConfirmNew.accumulationAmt = accumulationAmt
      this.orderData.subPayAmt = accumulationAmt
      const orderSheetNo = this.orderSheetNo
      this.$store.dispatch('ordersheet/calculateOrderAccumulation', { orderSheetNo, accumulationAmt })
    }
  },
  computed: {
    defaultAdd () {
      if (this.recentAddresses && this.recentAddresses.length) {
        return this.recentAddresses[0]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .order {
  &-info {
    display: flex;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 1.8rem;
    }

    &__title, &__value {
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 1.43;
      letter-spacing: -0.01rem;
      color: #333;
    }

    &__title {
      font-weight: 500;
    }

    &__value {
      max-width: 20.6rem;
      text-align: right;
    }
  }

  &-menu {
    &__item {
      padding-top: 2.8rem;
      &:first-child {
        border-top: 1px solid #eeeeee;
      }
    }
  }

  &-input {
    &:not(:first-child) {
      &.point {
        margin-top: 1.6rem;
      }
    }
    &__client {
      padding-top: 3.2rem;
      &:first-child {
        padding-top: 0;
      }
    }
    &__delivery {
      margin-top: 3.2rem;
    }
  }

  &-tab-content {
    padding: 2.33rem 2rem 2.6rem;
  }

  &-content {
    border-bottom: 1px solid #ededed;

    &.goods-info {
      padding-bottom: 0.4rem;
    }

    &.customer-info {
      padding: 2.83rem 2rem 3.8rem;
    }

    &.sale-info {
      padding: 3.23rem 2rem 2.8rem;
    }

    &.delivery-info {
      padding-top: 3.13rem;
    }

    &.payment-info {
      padding: 3.23rem 0 2.95rem;
      margin: 0 2rem;
    }

    &.payment-method {
      padding: 2rem 0;
      margin: 0 2rem;
    }
  }

  &-footer {
    padding: 2.4rem 2rem 4rem;
  }

  &-agree-label {
    display: inline-block;
    margin-left: 1.2rem;
    margin-top: 0.2rem;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;

    a {
      color: #4ba4d9;
      text-decoration: underline;
    }
  }

  &-submit-btn {
    margin-top: 2rem;
  }
}
</style>
