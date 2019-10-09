<template>
  <ul class="payment-method order-content">
    <li
      v-for="(method, key) in methods"
      :key="key"
      :class="['payment-method__item', key === active ? 'active' : '']"
      @click="setPayment(method, key)"
    >
      <i :class="['payment-method__image', method.icon]" />
      <p class="payment-method__name">
        <span>{{ method.name }}</span>
      </p>
    </li>
  </ul>
</template>

<script>
import { Alert } from '@/utils/event-bus'

export default {
  name: 'PaymentMethods',
  data () {
    return {
      active: 0,
      methods: [
        {
          icon: 'ic-card',
          name: '신용카드',
          payment: {
            pgType: 'INICIS',
            payType: 'CREDIT_CARD'
          }
        },
        {
          icon: 'ic-trade',
          name: '실시간 계좌이체',
          payment: {
            pgType: 'INICIS',
            payType: 'REALTIME_ACCOUNT_TRANSFER'
          }
        },
        {
          icon: 'ic-phone',
          name: '휴대폰 소액결제',
          payment: {
            pgType: 'INICIS',
            payType: 'MOBILE'
          }
        },
        {
          icon: 'ic-naver-pay',
          name: '네이버 페이',
          payment: {
            pgType: 'NAVER_EASY_PAY',
            payType: 'NAVER_EASY_PAY'
          }
        }
      ]
    }
  },
  methods: {
    setPayment (method, key) {
      this.active = key
      this.$emit('payments', method.payment)
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-method {
  display: grid;
  grid-gap: 0.7rem 0.7rem;
  grid-template-columns: repeat(auto-fit, 10.7rem);

  &__item {
    width: 10.7rem;
    height: 12rem;
    padding: 1.7rem 0 0;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    text-align: center;

    &:nth-of-type(3n) {
      margin-right: 0;
    }
  }

  &__item.active {
    border: none;
    background-color: #00d664;

    .payment-method__image {
      background-color: #fff;
    }

    .payment-method__name {
      span {
        color: #fff;
      }
    }
  }

  &__image {
    display: inline-block;
    width: 4.8rem;
    height: 4.8rem;
    background-color: #333;
    mask-size: cover;

    &.ic-card {
      mask-image: url(~@/assets/images/mobile/ic-common-card.svg);
    }

    &.ic-trade {
      mask-image: url(~@/assets/images/mobile/ic-common-trade.svg);
    }

    &.ic-phone {
      mask-image: url(~@/assets/images/mobile/ic-common-phone.svg);
    }

    &.ic-naver-pay {
      mask-image: url(~@/assets/images/mobile/ic-common-naver-pay.svg);
    }
  }

  &__name {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.6rem;
    width: 5.734rem;

    span {
      font-family: 'Noto Sans KR';
      font-size: 1.2rem;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.01rem;
      word-break: keep-all;
      color: #333;
    }
  }
}
</style>
