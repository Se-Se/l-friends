<template>
  <div v-if="order">
    <div class="payment-info order-content">
      <dl class="payment-info__item">
        <dt class="payment-info__title">총 주문금액</dt>
        <dd class="payment-info__value"><span class="price">{{ order.paymentInfo.totalStandardAmt + order.paymentInfo.deliveryAmt + order.paymentInfo.remoteDeliveryAmt - order.paymentInfo.deliveryCouponAmt | formatCurrency }}</span>원</dd>
      </dl>
      <dl class="payment-info__item children">
        <dt class="payment-info__title">총 상품금액</dt>
        <dd class="payment-info__value"><span class="price">{{ order.paymentInfo.totalStandardAmt | formatCurrency }}</span>원</dd>
      </dl>
      <dl class="payment-info__item children">
        <dt class="payment-info__title">배송비</dt>
        <dd class="payment-info__value"><span class="price">{{ order.paymentInfo.deliveryAmt + order.paymentInfo.remoteDeliveryAmt | formatCurrency }}</span>원</dd>
      </dl>
      <dl class="payment-info__item">
        <dt class="payment-info__title">총 할인금액</dt>
        <dd class="payment-info__value"><span class="price">{{ totalDiscountAmt * -1 || 0 | formatCurrency }}</span>원</dd>
      </dl>
      <dl class="payment-info__item children">
        <dt class="payment-info__title">즉시 할인</dt>
        <dd class="payment-info__value"><span class="price">{{ order.paymentInfo.totalImmediateDiscountAmt * -1 || 0 | formatCurrency }}</span>원</dd>
      </dl>
      <dl class="payment-info__item children">
        <dt class="payment-info__title">추가 할인</dt>
        <dd class="payment-info__value"><span class="price">{{ order.paymentInfo.totalAdditionalDiscountAmt * -1 || 0 | formatCurrency }}</span>원</dd>
      </dl>
      <dl class="payment-info__item children">
        <dt class="payment-info__title">상품 쿠폰</dt>
        <dd class="payment-info__value"><span class="price">{{ order.paymentInfo.productCouponAmt * -1 || 0 | formatCurrency }}</span>원</dd>
      </dl>
      <dl class="payment-info__item children">
        <dt class="payment-info__title">장바구니 쿠폰</dt>
        <dd class="payment-info__value"><span class="price">{{ order.paymentInfo.cartCouponAmt * -1 || 0 | formatCurrency }}</span>원</dd>
      </dl>
      <dl
        v-if="isExec"
        class="payment-info__item employee"
      >
        <dt class="payment-info__title">임직원 포인트</dt>
        <dd class="payment-info__value"><span class="price">{{ accumulationAmt > 0 ? accumulationAmt * -1 : accumulationAmt | formatCurrency }}</span>원</dd>
      </dl>
      <dl class="payment-info__item sale-price">
        <dt class="payment-info__title">결제 금액</dt>
        <dd class="payment-info__value"><span class="price">{{ order.paymentInfo.paymentAmt | formatCurrency }}</span>원</dd>
      </dl>
    </div>
    <payment-methods
      v-if="order.paymentInfo.paymentAmt > 0"
      class="payment-method order-content"
      @payments="payment => this.$emit('payments', payment)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaymentMethods from '@/components/mobile/order/PaymentMethods'

export default {
  name: 'OrderPaymentConfirm',
  props: ['order'],
  components: {
    PaymentMethods
  },
  data () {
    return {
      active: {
        order: false,
        payment: false
      },
      accumulationAmt: 0
    }
  },
  computed: {
    ...mapGetters('profile', ['isExec']),
    totalStandardAmt () {
      return this.order.paymentInfo.totalStandardAmt
    },
    totalDiscountAmt () {
      return this.order.paymentInfo.totalAdditionalDiscountAmt +
        this.order.paymentInfo.totalImmediateDiscountAmt +
        this.order.paymentInfo.productCouponAmt +
        this.order.paymentInfo.cartCouponAmt
    },
    totalDeliveryAmt () {
      return this.order.paymentInfo.deliveryAmt
    },
    payAmt () {
      return this.totalStandardAmt - this.totalDiscountAmt + this.totalDeliveryAmt
    },
    showTotalDiscountAmt () {
      return this.totalDiscountAmt > 0 ? this.totalDiscountAmt * -1 : this.totalDiscountAmt
    },
    showDeliveryCouponAmt () {
      return this.order.paymentInfo.deliveryCouponAmt > 0 ? this.order.paymentInfo.deliveryCouponAmt * -1 : this.order.paymentInfo.deliveryCouponAmt
    },
    showTotalDeliveryAmt () {
      return this.order.paymentInfo.deliveryAmt + this.order.paymentInfo.remoteDeliveryAmt - this.order.paymentInfo.deliveryCouponAmt
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-info {
  padding: 3.2rem 2rem 4rem;

  &__item {
    display: flex;
    justify-content: space-between;

    &:not(:first-child) {
      margin-top: 2.65rem;
    }

    dt, dd {
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 1.43;
      letter-spacing: -0.01rem;
      color: #333;

      .price {
        font-family: Volte, sans-serif;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1.25;
      }
    }

    dd {
      font-weight: bold;
    }

    &.children {
      margin-top: 1rem;
      dt, dd {
        color: #999;
      }
    }
    &.employee {
      margin-top: 2.8rem;
    }
    &.sale-price {
      margin-top: 3rem;

      dt {
        margin-top: 0.9rem;
      }

      dd {
        color: #ff414e;
        font-size: 2.6rem;
        font-weight: bold;
        line-height: 0.71;
        letter-spacing: -0.01rem;

        .price {
          font-size: 2.8rem;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
