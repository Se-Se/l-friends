<template>
  <div
    v-if="option"
    class="order-info"
  >
    <div class="order-info__chk">
      <app-checkbox
        v-model="option.checkYn"
        :id="String(option.orderOptionNo)"
        :height="21.6"
        :max-length="1000"
        @change="checkChange"
      />
    </div>
    <div class="order-goods-image">
      <img
        :src="option.imageUrl"
        :title="option.productName"
        :alt="option.productName"
      >
    </div>
    <div class="order-goods-info">
      <p class="order-goods__name">
        {{ option.productName }}
      </p>
      <div class="order-goods__options">
        <span class="order-goods__option">{{ option.optionName }}: {{ option.optionValue }}</span> /
        <span class="order-goods__count">구매수량 : {{ option.showOrderCnt }}</span>
      </div>
      <p class="order-goods__price">
        {{ option.price.buyAmt | formatCurrency }}원
      </p>
      <number-spinner
        class="order-number-spinner"
        v-model="canRefundCnt"
        :max="option.orderCnt"
        @input="updateProductCnt(canRefundCnt)"
      />
    </div>
  </div>
</template>

<script>
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import NumberSpinner from '@/components/mobile/common/NumberSpinner'
import RefundItemNew from '@/components/mixins/mypage/order/claim/RefundItemNew'

export default {
  name: 'OrderOption',
  mixins: [RefundItemNew],
  components: {
    AppCheckbox,
    NumberSpinner
  },
  data () {
    return {
      productCnt: this.option.orderCnt
    }
  },
  computed: {
    canRefundCnt: {
      get () {
        return this.productCnt
      },
      set (val) {
        this.productCnt = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
  &-info {
    position: relative;
    display: flex;
    margin-top: 4rem;
    justify-content: space-between;

    &__tools {
      margin-top: 2.4rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      > li {
        width: calc(50% - 0.35rem);

        &:not(:first-child):not(:nth-of-type(2)) {
          margin-top: 0.7rem;
        }
      }
    }

    &__chk {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  &-number-spinner {
    padding-top: 1.6rem;
  }

  &-goods {
    &-image {
      margin-top: 0.6rem;
      width: 9.6rem;

      img {
        width: 100%;
      }
    }

    &-info {
      width: calc(100% - 12.4rem);
    }

    &__name {
      padding-right: 2rem;
      font-family: 'Noto Sans KR';
      font-weight: normal;
      font-size: 1.6rem;
      line-height: 1.5;
      letter-spacing: -0.01rem;
      color: #333;
      word-break: keep-all;
    }

    &__options {
      margin-top: 0.8rem;
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 1.43;
      letter-spacing: -0.01rem;
      color: #999;
    }

    &__price {
      margin-top: 1rem;
      font-family: Volte, sans-serif;
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: -0.01rem;
      color: #333;

      .price-symbol {
        font-family: 'Noto Sans KR';
        font-size: 1.4rem;
        font-weight: bold;
        letter-spacing: normal;
      }
    }

    &__status {
      margin-top: 1rem;
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: bold;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #00d664;
    }
  }
}
</style>
