<template>
  <div>
    <div id="container">
      <div class="complete" v-if="order">
        <div class="complete-header">
          <h2 class="complete-header__title">주문이 정상적으로 완료되었습니다.</h2>
          <p class="complete-header__numb">
            <router-link :to="`/mypage/orderdetail/${orderNo}`">{{orderNo}}</router-link>
          </p>
        </div>
        <div class="complete-content">
          <div class="complete-content__image"><img src="@/assets/images/mobile/complete.png" alt="주문 결제 완료"></div>
          <div class="user-block">
            <dl class="user-block__row">
              <dt class="user-block__label">주문자</dt>
              <dd class="user-block__info">{{this.order.orderer.ordererName}}</dd>
            </dl>
            <dl class="user-block__row">
              <dt class="user-block__label">배송지 정보</dt>
              <dd class="user-block__info">
                <p class="delivery-info">{{this.order.shippingAddress.receiverName}}</p>
                <p class="delivery-info">{{this.order.orderer.ordererContact1}}</p>
                <p class="delivery-info">({{this.order.shippingAddress.receiverZipCd}}) {{this.order.shippingAddress.receiverAddress}} {{this.order.shippingAddress.receiverDetailAddress}}</p>
              </dd>
            </dl>
            <dl class="user-block__row">
              <dt class="user-block__label">결제 정보</dt>
              <dd class="user-block__info">
                <template v-if="this.order.payType === 'ACCUMULATION'">
                  임직원 포인트
                </template>
                <template v-else>
                  {{this.order.payTypeLabel}}
                </template>
              </dd>
            </dl>
          </div>
          <div class="order-block">
            <dl class="order-block__row title">
              <dt class="order-block__label">총 주문금액</dt>
              <dd class="order-block__price">{{MyMiliForma(this.order.lastOrderAmount.standardAmt + this.order.lastOrderAmount.deliveryAmt + this.order.lastOrderAmount.remoteDeliveryAmt - this.order.lastOrderAmount.deliveryCouponDiscountAmt)}}<em>원</em></dd>
            </dl>
            <div class="order-block__child">
              <dl class="order-block__row">
                <dt class="order-block__label">총 상품금액</dt>
                <dd class="order-block__price">{{MyMiliForma(this.order.lastOrderAmount.standardAmt)}}<em>원</em></dd>
              </dl>
              <dl class="order-block__row">
                <dt class="order-block__label">배송비</dt>
                <dd
                  v-if="this.order.lastOrderAmount.deliveryAmt > 0"
                  class="order-block__price"
                >
                  {{MyMiliForma(this.order.lastOrderAmount.deliveryAmt + this.order.lastOrderAmount.remoteDeliveryAmt - this.order.lastOrderAmount.deliveryCouponDiscountAmt)}}<em>원</em>
                </dd>
                <dd
                  v-else
                  class="order-block__price"
                >
                  <em>무료배송</em>
                </dd>
              </dl>
            </div>
            <dl class="order-block__row title" v-if="this.totalDiscountAmt !== 0">
              <dt class="order-block__label">총 할인금액</dt>
              <dd class="order-block__price">-{{MyMiliForma(this.totalDiscountAmt)}}<em>원</em></dd>
            </dl>
            <div class="order-block__child">
              <dl class="order-block__row" v-if="this.order.lastOrderAmount.immediateDiscountAmt !== 0">
                <dt class="order-block__label">즉시 할인</dt>
                <dd class="order-block__price">-{{MyMiliForma(this.order.lastOrderAmount.immediateDiscountAmt)}}<em>원</em></dd>
              </dl>
              <dl class="order-block__row" v-if="isSaleExec && this.order.lastOrderAmount.additionalDiscountAmt !== 0">
                <dt class="order-block__label">임직원 할인</dt>
                <dd class="order-block__price">-{{MyMiliForma(this.order.lastOrderAmount.additionalDiscountAmt)}}<em>원</em></dd>
              </dl>
              <dl class="order-block__row" v-if="this.order.lastOrderAmount.productCouponDiscountAmt !== 0">
                <dt class="order-block__label">상품 쿠폰</dt>
                <dd class="order-block__price">-{{MyMiliForma(this.order.lastOrderAmount.productCouponDiscountAmt)}}<em>원</em></dd>
              </dl>
              <dl class="order-block__row" v-if="this.order.lastOrderAmount.cartCouponDiscountAmt !== 0">
                <dt class="order-block__label">장바구니 쿠폰</dt>
                <dd class="order-block__price">-{{MyMiliForma(this.order.lastOrderAmount.cartCouponDiscountAmt)}}<em>원</em></dd>
              </dl>
            </div>
            <dl class="order-block__row title" v-if="this.order.lastOrderAmount.subPayAmt > 0">
              <dt class="order-block__label">임직원 포인트 결제</dt>
              <dd class="order-block__price">-{{MyMiliForma(this.order.lastOrderAmount.subPayAmt)}}<em>원</em></dd>
            </dl>
            <dl class="order-block__row result">
              <dt class="order-block__label">결제 금액</dt>
              <dd class="order-block__price">{{MyMiliForma(this.order.lastOrderAmount.chargeAmt)}}<em>원</em></dd>
            </dl>
            <information class="information">
              마이페이지를 통해 주문내역 및 배송상태를 조회할 수 있습니다.
            </information>
          </div>
          <div class="complete-content__button">
            <div class="complete-content__mypage">
              <app-button
                type="secondary"
                to="/mypage"
                bold
              >
                마이페이지 가기
              </app-button>
            </div>
            <div class="complete-content__home">
              <app-button
                type="success"
                to="/"
                bold
              >
                홈으로 가기
              </app-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from '@/components/mobile/common/button/Button'
import Information from '@/components/mobile/common/Information'
import PaymentConfirmNew from '@/components/mixins/order/PaymentConfirmNew'

export default {
  name: 'Complete',
  components: {
    AppButton,
    Information
  },
  mixins: [PaymentConfirmNew]
}
</script>

<style lang="scss" scoped>
.complete{
  padding: 4.8rem 0 0;
  &-header {
    margin-bottom: 2.22rem;
    text-align: center;
    &__title {
      color: #333333;
      font-size: 1.8rem;
      font-weight: bold;
      font-family: 'Noto Sans KR';
      line-height: normal;
      letter-spacing: -0.01rem;
    }
    &__numb {
      margin-top: 0.83rem;
      color: #4ba4d9;
      font-size: 1.4rem;
      font-family: 'Noto Sans KR';
      line-height: 1.43;
      letter-spacing: -0.01rem;
      a{
        display: inline-block;
        text-decoration: underline;
      }
    }
  }
  &-content {
    &__image {
      width: 100%;
    }
    .user-block {
      padding: 0 2rem;
      &__row {
        display: flex;
        justify-content: space-between;
        padding: 1.5rem 1.5rem 1.7rem 1.6rem;
        border-bottom: 1px solid #ededed;
        color: #333333;
        letter-spacing: -0.01rem;

        &:first-child {
          padding-top: 1.1rem;
        }
      }
      &__label {
        flex: 0 0 auto;
        font-size: 1.4rem;
        font-family: 'Noto Sans KR';
        font-weight: normal;
        line-height: 1.43;
        text-align: left;
        vertical-align: top;
      }
      &__info {
        flex: 1 1 auto;
        max-width: 20rem;
        font-size: 1.4rem;
        font-family: 'Noto Sans KR';
        font-weight: normal;
        line-height: 1.43;
        font-size: 1.4rem;
        text-align: right;
      }
    }
    .order-block {
      padding: 1.5rem 3.5rem 0 3.6rem;
      &__child {
        color: #999999;

        .order-block__row {
          margin-top: 1rem;
        }
      }
      .title {
        &:not(:first-child) {
          margin-top: 1.8rem;
        }
      }
      &__row {
        height: 2rem;
        display: flex;
        justify-content: space-between;
      }
      &__label {
        flex: 0 0 auto;
        font-size: 1.4rem;
        font-family: 'Noto Sans KR';
        font-weight: normal;
        line-height: 1.43;
        text-align: left;
      }
      &__price {
        flex: 1 1 auto;
        max-width: 20rem;
        font-family: Volte, sans-serif;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1.43;
        text-align: right;
        em {
          font-size: 1.4rem;
          font-family: 'Noto Sans KR';
        }
      }
      .result {
        padding-top: 2.4rem;
        height: auto;

        .order-block__label {
          margin-top: 0.3rem;
        }

        .order-block__price {
          color: #ff414e;
          font-size: 2.8rem;
          line-height: 0.71;
          em {
            font-size: 2.6rem;
            font-weight: bold;
          }
        }
      }
    }
    .information {
      margin-top: 3.5rem;
    }
    &__button {
      margin: 3.7rem 2rem 4rem;
      display: flex;
      justify-content: space-between;
    }
    &__mypage {
      width: calc(50% - 0.35rem);
    }
    &__home {
      width: calc(50% - 0.35rem);
    }
  }
}

.delivery-info {
  &:not(:first-child) {
    margin-top: 1rem;
  }
}
</style>
