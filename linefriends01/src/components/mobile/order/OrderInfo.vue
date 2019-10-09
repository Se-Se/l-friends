<template>
  <div :class="['order-info__wrapper', mode]">
    <div class="order-header">
      <div>
        <p class="order-date">
          {{ product.orderYmdt.substring(0,10) }}
        </p>
        <p class="order-no">
          {{ $t('order.number')}} : {{ product.orderNo }}
        </p>
      </div>
      <router-link
        v-if="list"
        class="order-to-detail"
        :to="`/mypage/orderdetail/${product.orderNo}`"
      >
        {{ $t('order.detailOrder') }}
        <span class="order-to-detail__ico-arrow"></span>
      </router-link>
    </div>
    <div
      v-for="(option, pk) in showOptions"
      :key="pk"
    >
      <order-option
        :option="option"
        @showAddReviewPopup="$emit('showAddReviewPopup', option)"
      />
    </div>
  </div>
</template>

<script>
import OrderOption from './OrderOption'

export default {
  name: 'OrderInfo',
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    list: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'list'
    }
  },
  components: {
    OrderOption
  },
  computed: {
    showOptions () {
      let options = this.product.orderOptions.sort((a, b) => {
        return a.claimNo - b.claimNo
      })

      options = options.map((item, key) => {
        return {
          ...item,
          showButton: key === options.length - 1 || options[key + 1].claimNo !== item.claimNo || item.claimNo === null
        }
      })

      return options
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-date {
    font-size: 1.4rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #999;
  }

  &-no {
    margin-top: 0.9rem;
    font-size: 1.4rem;
    font-family: 'Noto Sans KR';
    font-weight: bold;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &-to-detail {
    position:relative;
    margin-right: 1rem;
    font-size: 1.4rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #999;
    &__ico-arrow {
      position: absolute;
      top: 50%;
      right: -1.6rem;
      transform: translateY(-50%);
      vertical-align: top;
      width: 1.8rem;
      height: 1.8rem;
      background-size: 100% 100%;
      background-image: url(~@/assets/images/mobile/ic-small-arrow.svg);
    }
  }

  &-info {
    position: relative;
    display: flex;
    margin-top: 4rem;
    justify-content: space-between;

    &__wrapper {
      padding: 0 2rem;

      &.status .order-info {
        margin-top: 3.6rem;
      }
    }
  }
}
</style>
