<template>
  <div class="mypage__block order-info__wrapper">
    <ul class="order-info">
      <li class="order-info__item">
        <router-link
          to="/mypage/mycoupon"
          class="order-info__link"
        >
          <span class="order-info__label ic-coupon">{{ $t('user.couponBox') }}</span>
          <span class="order-info__count">{{ mySummary && mySummary.usableCouponCnt }}</span>
        </router-link>
      </li>
      <li class="order-info__item">
        <router-link
          to="/mypage/myreview"
          class="order-info__link"
        >
          <span class="order-info__label ic-review">{{ $t('user.review') }}</span>
          <span class="order-info__count">{{ mySummary && mySummary.reviewCnt }}</span>
        </router-link>
      </li>
      <li class="order-info__item">
        <router-link
          to="/mypage/like"
          class="order-info__link"
        >
          <span class="order-info__label ic-like">{{ $t('user.likeProduct') }}</span>
          <span class="order-info__count">{{ mySummary && mySummary.likeCnt }}</span>
        </router-link>
      </li>
      <li class="order-info__item">
        <!-- <router-link
          to="/mypage/orderlist"
          class="order-info__link"
        >
          <span class="order-info__label ic-delivery">{{ $t('order.delivering') }}</span>
          <span class="order-info__count">{{ mySummary && mySummary.deliveringCnt }}</span>
        </router-link> -->
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OrderInfo',
  computed: {
    ...mapState('member', ['mySummary'])
  }
}
</script>

<style lang="scss" scoped>
.order-info {
  display: flex;
  flex-wrap: wrap;

  &__item {
    width: 50%;
    height: calc(6rem + 1px);
    padding: 2.3rem 2rem 0;
    border-color: #ededed;
    border-style: solid;
    border-width: 0 1px 1px 0;

    &:nth-of-type(2n) {
      border-right-width: 0;
    }

    &:last-child, &:nth-last-child(2) {
      border-bottom: 0;
    }
  }

  &__link {
    display: flex;
    justify-content: space-between;
  }

  &__label {
    font-family: 'Noto Sans KR';
    font-weight: 500;
    font-size: 1.4rem;
    letter-spacing: -0.01rem;
    color: #333;

    &::before {
      content: '';
      display: inline-block;
      margin-top: -0.9rem;
      margin-right: 0.8rem;
      width: 3.2rem;
      height: 3.2rem;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      vertical-align: top;
    }

    &.ic-delivery::before {
      background-image: url(~@/assets/images/common/mypage/ic-delivery.svg)
    }

    &.ic-coupon::before {
      background-image: url(~@/assets/images/common/mypage/ic-coupon.svg)
    }

    &.ic-review::before {
      margin-top: -0.8rem;
      margin-right: 0.4rem;
      background-image: url(~@/assets/images/common/mypage/ic-review.svg)
    }

    &.ic-like::before {
      background-image: url(~@/assets/images/common/mypage/ic-like.svg)
    }
  }

  &__count {
    font-family: Volte, sans-serif;
    font-weight: 600;
    font-size: 1.8rem;
    color: #00d664;
  }
}
</style>
