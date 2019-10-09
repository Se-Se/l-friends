<template>
  <div class="cart-info">
    <dl class="cart-info__item">
      <dt>총 상품금액</dt>
      <dd><span class="price">{{ this.showTotalItemPrice }}</span>원</dd>
    </dl>
    <dl class="cart-info__item">
      <dt>총 할인금액</dt>
      <dd><span class="price">-{{ this.showTotalDiscountAmount }}</span>원</dd>
    </dl>
    <!--
    <dl class="cart-info__item children">
      <dt>즉시 할인</dt>
      <dd><span class="price">-5,000</span>원</dd>
    </dl>
    <dl class="cart-info__item children">
      <dt>추가 할인</dt>
      <dd><span class="price">0</span>원</dd>
    </dl>
    <dl class="cart-info__item children">
      <dt>상품 쿠폰</dt>
      <dd><span class="price">0</span>원</dd>
    </dl>
    <dl class="cart-info__item children">
      <dt>장바구니 쿠폰</dt>
      <dd><span class="price">0</span>원</dd>
    </dl>
    <dl class="cart-info__item children">
      <dt>환불 차감금액</dt>
      <dd><span class="price">0</span>원</dd>
    </dl>
    -->
    <dl class="cart-info__item">
      <dt>총 배송비<template v-if="havePayOnDelivery"> ({{ $t('layout.cart.exempt') }})</template></dt>
      <dd v-if="totalShippingCost > 0">
        <span class="price">{{ this.showTotalShippingCost }}</span>원
      </dd>
      <dd v-else>
        무료배송
      </dd>
    </dl>
    <dl class="cart-info__item sale-price">
      <dt>결제 예정금액</dt>
      <dd><span class="price">{{ this.showPaymentAmount }}</span>원</dd>
    </dl>

    <div class="cart-info__button">
      <cart-btn-new />
    </div>
  </div>
</template>

<script>
import CartPriceInfoNew from '@/components/mixins/cart/CartPriceInfoNew'
import CartBtnNew from './CartBtnNew'

export default {
  name: 'CartInfo',
  mixins: [CartPriceInfoNew],
  components: {
    CartBtnNew
  }
}
</script>

<style lang="scss" scoped>
.cart-info {
  padding: 3.2rem 2rem 4rem;

  &__button {
    margin-top: 3.8rem;
  }

  &__item {
    display: flex;
    justify-content: space-between;

    &:not(:first-child) {
      margin-top: 1.6rem;
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
      margin-top: 0.8rem;
      dt, dd {
        color: #999;
      }
    }

    &.sale-price {
      margin-top: 1.9rem;

      dt {
        margin-top: 0.9rem;
      }

      dd {
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
