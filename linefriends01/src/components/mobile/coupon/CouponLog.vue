<template>
  <div :class="['point-log', expire ? 'expire' : '']">
    <dl class="point-log__item">
      <dt class="point-log__label">
        쿠폰명
      </dt>
      <dd class="point-log__value alive">
        {{ coupon.couponName }}
      </dd>
    </dl>
    <dl class="point-log__item">
      <dt class="point-log__label">
        혜택
      </dt>
      <dd class="point-log__value sale">
        <span v-if="coupon.discountAmt">
          {{ coupon.discountAmt | formatCurrency }}{{ $t('currency') }} 할인
        </span>
        <span v-else>
          {{ coupon.discountRate }}% 할인
          (최대 {{ coupon.maxDiscountAmt | formatCurrency }}{{ $t('currency') }})
        </span>
      </dd>
    </dl>
    <dl class="point-log__item">
      <dt class="point-log__label">
        조건
      </dt>
      <dd class="point-log__value" v-if="!coupon.maxSalePrice && !coupon.minSalePrice">{{ $t('mypage.coupon.goodsValidity') }}</dd>
      <dd class="point-log__value" v-else>
        {{ coupon.minSalePrice | formatCurrency }}{{ $t('currency') }} 이상
        <span v-if="coupon.maxSalePrice">~ {{ coupon.maxSalePrice | formatCurrency }}{{ $t('currency') }} 이하</span>
      </dd>
    </dl>
    <template v-if="expire">
      <dl class="point-log__item">
        <dt class="point-log__label">
          사용/만료일시
        </dt>
        <dd class="point-log__value">
          {{ (coupon.useYmdt || coupon.useEndYmdt) | dateFormatStr('yyyy-MM-dd HH:mm') }}
        </dd>
      </dl>
      <dl class="point-log__item">
        <dt class="point-log__label">
          사용여부
        </dt>
        <dd class="point-log__value alive">
          {{ coupon.useYmdt ? '사용완료' : '기간만료' }}
        </dd>
      </dl>
    </template>
    <dl
      v-else
      class="point-log__item"
    >
      <dt class="point-log__label">
        유효기간
      </dt>
      <dd class="point-log__value">
        {{ coupon.useEndYmdt | dateFormatStr('yyyy-MM-dd HH:mm') }}
      </dd>
    </dl>
    <dl class="point-log__item">
      <dt class="point-log__label">
        쿠폰종류
      </dt>
      <dd class="point-log__value">
        {{ couponType }}
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'CouponLog',
  props: {
    coupon: {
      type: Object,
      default: () => ({})
    },
    expire: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    couponType () {
      switch (this.coupon.couponType) {
        case 'PRODUCT':
          return '상품쿠폰'
        case 'PRODUCT_PLUS':
          return '상품플러스쿠폰'
        case 'CART':
          return '장바구니쿠폰'
        case 'CART_DELIVERY':
          return '배송비쿠폰'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.point-log {
  padding: 3.2rem 2rem;

  &__item {
    display: flex;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 0.9rem;
    }
  }

  &__label, &__value {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__value {
    text-align: right;
    font-weight: 500;
    width: 20rem;
    height: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;


    &.sale {
      color: #ff414e;
    }
  }

  &.expire {
    .point-log__value:not(.alive) {
      color: #999;
    }
  }
}
</style>
