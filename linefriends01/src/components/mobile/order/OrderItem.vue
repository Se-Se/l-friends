<template>
  <div class="order-item__wrapper">
    <div class="order-item__container"> 
      <div class="order-item__thumbnail">
        <img :src="goods.imageUrl">
      </div>
      <div class="order-item">
        <ul class="goods-sticker" v-if="goods.reservation">
          <li class="goods-sticker__item reserve">예약상품</li>
          <li class="datedelivery">{{goods.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}일 부터 순차 배송</li>
        </ul>
        <p class="order-item__title">
          {{(goods.showProductName) | wordsFormat(68)}}
        </p>
        <p class="order-item__options">
          <span class="option-names">
            <template v-for="showOption, index in goods.showOptions"><span class="bar" v-if="index != 0">/</span> {{ showOption }}</template>
          </span>
          <span class="option-count">수량: {{ goods.orderCnt }}</span>
          <template v-if="goods.showAddPrice">
            {{ goods.showAddPrice }}
          </template>
        </p>
        <div class="order-item-detail">
          <dl class="order-item-detail__row">
            <dt>할인 적용 금액</dt>
            <dd><span class="price">{{ goods.showPrice }}</span>{{ $t('currency') }}</dd>
          </dl>
          <dl class="order-item-detail__row child">
            <dt>상품 금액</dt>
            <dd><span class="price">{{ goods.showStandardAmt }}</span>{{ $t('currency') }}</dd>
          </dl>
          <dl class="order-item-detail__row child">
            <dt>할인 금액</dt>
            <dd><span class="price">{{ goods.showDiscountAmt == 0 ? goods.showDiscountAmt : '- ' + goods.showDiscountAmt }}</span>{{ $t('currency') }}</dd>
          </dl>
          <dl class="order-item-detail__row">
            <dt>배송비</dt>
            <dd class="free">
              <template v-if="!goods.deliverable">
                {{ goods.showShippingFee }}
              </template>
              <template v-else-if="!goods.free">
                {{ goods.showShippingFee }}원<template v-if="goods.deliveryPayType === 'PAY_ON_DELIVERY'">(착불)</template>
              </template>
              <template v-else>
                무료배송
              </template>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import AppButton from '@/components/mobile/common/button/Button'
import NumberSpinner from '@/components/mobile/common/NumberSpinner'

export default {
  name: 'CartItem',
  components: {
    AppCheckbox,
    AppButton,
    NumberSpinner
  },
  props: {
    goods: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      count: 1
    }
  }
}
</script>

<style lang="scss" scoped>
.order-item {
  width: 21.1rem;

  &__wrapper {
    padding: 3.23rem 2rem 3rem;
  }

  &__container {
    display: flex;
    justify-content: space-between;
  }

  &__thumbnail {
    width: 9.6rem;

    img {
      width: 100%;
    }
  }

  &__title {
    max-width: 19.1rem;
    word-break: keep-all;
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__options {
    font-size: 0;
    margin-top: 0.8rem;

    > * {
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 1.43;
      letter-spacing: -0.01rem;
      color: #999;
    }
  }

  &-detail {
    padding-top: 1.2rem;

    &__row {
      display: flex;
      justify-content: space-between;

      &:not(:last-child) {
        margin-bottom: 0.7rem;
      }

      dt {
        font-family: 'Noto Sans KR';
        font-size: 1.4rem;
        font-weight: bold;
        line-height: 1.67;
        letter-spacing: -0.01rem;
        color: #333;
      }

      dd {
        padding-top: 0.1rem;
        font-family: Volte, sans-serif;
        font-size: 1.4rem;
        font-weight: 600;
        line-height: 1.67;
        letter-spacing: -0.01rem;
        color: #333;
      }

      .free {
        font-family: 'Noto Sans KR';
        font-weight: bold;
      }

      &.child {
        dt, dd {
          color: #999;
        }
      }
    }
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 2.4rem;

    > * {
      width: 48.345%;
    }
  }
  .goods-sticker{
  display: flex;
  margin: 1.2rem 0 0.8rem;
  &__item {
    line-height: 1.6rem;
    padding: 0 0.7rem;
    border: 1px solid #4ba4d9;
    border-radius: 1.866rem;
    font-family: "Noto Sans KR", sans-self;
    font-size: 1rem;
    font-weight: 500;
    color: #4ba4d9;
    &:not(:last-child) {
      margin-right: 0.2rem;
    }
    &.reserve{
      color:#4ba4d9;
    }
    &.coupon {
      background: #4ba4d9;
      color: #fff;
    }

    &.soldout {
      border: 1px solid #a5aab0;
      color: #a5aab0;
    }
  }
  .datedelivery{
    line-height: 1.6rem;
    color:#4ba4d9;
    margin-left: 0.2rem;
  }
}

}

.option-name {
  display: inline-block;
  padding-right: 1.2rem;
}

.option-count {
  display: inline-block;
}
</style>
