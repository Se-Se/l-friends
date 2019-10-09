<template>
  <div>
    <dl class="order-block__row">
      <dt class="order-block__label">
        환불 상품금액
      </dt>
      <dd class="order-block__value price">
        {{ productAmtInfo.standardPrice + deliveryAmtInfo.totalAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
      </dd>
    </dl>
    <div class="order-block__child">
      <dl class="order-block__row">
        <dt class="order-block__label">
          총 상품금액
        </dt>
        <dd class="order-block__value price">
          {{ productAmtInfo.standardPrice | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
      <dl class="order-block__row">
        <dt class="order-block__label">
          환불 배송비
        </dt>
        <dd class="order-block__value price">
          {{ deliveryAmtInfo.totalAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
    </div>
    <dl class="order-block__row">
      <dt class="order-block__label">
        차감금액
      </dt>
      <dd class="order-block__value price">
        -{{ subtractionAmtInfo.totalAmt + subtractionAmtInfo.refundAdjustAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
      </dd>
    </dl>
    <div class="order-block__child">
      <dl class="order-block__row">
        <dt class="order-block__label">
          즉시 할인
        </dt>
        <dd class="order-block__value price">
          -{{ productAmtInfo.immediateDiscountAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
      <dl class="order-block__row">
        <dt class="order-block__label">
          추가 할인
        </dt>
        <dd class="order-block__value price">
          -{{ productAmtInfo.additionalDiscountAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
      <dl class="order-block__row">
        <dt class="order-block__label">
          상품 쿠폰
        </dt>
        <dd class="order-block__value price">
          -{{ productAmtInfo.productCouponDiscountAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
      <dl class="order-block__row">
        <dt class="order-block__label">
          장바구니 쿠폰
        </dt>
        <dd class="order-block__value price">
          -{{ subtractionAmtInfo.cartCouponAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
      <dl class="order-block__row">
        <dt class="order-block__label">
          환불 차감금액
        </dt>
        <dd class="order-block__value price">
          -{{ subtractionAmtInfo.refundAdjustAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
    </div>
    <dl class="order-block__row bottom">
      <dt class="order-block__label">
        환불 금액
      </dt>
      <dd class="order-block__value price total">
        {{ refundPayAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
      </dd>
    </dl>
    <div class="order-block__child">
      <dl class="order-block__row">
        <dt class="order-block__label">
          결제 취소금액
        </dt>
        <dd class="order-block__value price">
          {{ refundMainPayAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
      <dl class="order-block__row" v-if="isExec">
        <dt class="order-block__label">
          임직원 포인트
        </dt>
        <dd class="order-block__value price">
          {{ refundSubPayAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RefundInfoNew from '@/components/mixins/mypage/order/common/RefundInfoNew'
export default {
  mixins: [RefundInfoNew],
  computed: {
    ...mapGetters('profile', ['isExec'])
  }
}
</script>
