<template>
  <div
    v-if="option"
    class="order-info"
  >
    <div class="order-goods-image">
      <router-link :to="`/goods/detail/${option.productNo}`">
      <img
        :src="option.imageUrl"
        :title="option.productName"
        :alt="option.productName"
      >
      </router-link>
    </div>
    <div class="order-goods-info">
      <ul class="goods-sticker" v-if="option.reservation">
        <li class="goods-sticker__item reserve">예약상품</li>
        <li class="datedelivery">{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}일 부터 순차 배송</li>
      </ul>
      <p class="order-goods__name">
        <router-link :to="`/goods/detail/${option.productNo}`">{{ option.productName }}</router-link>
      </p>
      <div class="order-goods__options">
        <span class="order-goods__option">{{ option.optionName }}: {{ option.optionValue }}</span>
        <span class="order-goods__count">구매수량 : {{ option.orderCnt | formatCurrency }}개</span>
      </div>
      <p class="order-goods__price">
        {{ option.showPrice | formatCurrency }}<span class="price-symbol">{{ $t('currency') }}</span>
      </p>
      <p class="order-goods__status" :class="option.statusLabel === '배송완료' || option.statusLabel === '구매완료' || option.statusLabel === '취소확정'  ? 'txt_color_blue' : ''">
        {{ option.statusLabel }}
      </p>
      <p v-if="showDisable >= 0" class="order-goods__status">
        환불불가
      </p>
      <order-buttons
        v-if="option.showButton"
        :option="option"
        :nonMember="nonMember"
        @showInquiryPopup="$router.push(`/goods/detail/${option.productNo}/inquiry`)"
        @showAddReviewPopup="$emit('showAddReviewPopup', option)"
        @showReturnDetailPopup="claimNo => $router.push(`/mypage/returndetail/${claimNo}`)"
        @showCancelDetailPopup="optionNo => $router.push(`/mypage/canceldetail/${optionNo}`)"
      />
    </div>
  </div>
</template>

<script>
import OrderOptionNew from '@/components/mixins/mypage/order/OrderOptionNew'
import OrderButtons from '@/components/mobile/order/OrderButtons'

export default {
  name: 'OrderOption',
  mixins: [OrderOptionNew],
  components: {
    OrderButtons
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

    &__chk {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  &-number-spinner {
    padding-top: 1.5rem;
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
      word-break: break-word;
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

    &__option {
      margin-right: 0.8rem;
    }

    &__price {
      margin-top: 0.5rem;
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
      &.txt_color_blue {
        color: #4BA4D9;
      }
    }
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
</style>
