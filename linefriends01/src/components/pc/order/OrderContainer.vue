<template>
  <div>
    <div id="container">
      <div class="complete">
        <div class="complete-header">
          <h2 class="complete-header__title">
            주문이 정상적으로 완료되었습니다.
          </h2>
          <p class="complete-header__numb">
            <router-link :to="`/mypage/orderdetail/${orderNo}`">{{orderNo}}</router-link>
          </p>
        </div>
        <div class="complete-content">
          <div class="complete-content__image">
            <img
              src="@/assets/images/pc/order/complete.png"
              alt="주문 결제 완료"
            >
          </div>
          <div class="user-block" v-if="order">
            <dl class="user-block__row">
              <dt class="user-block__label">
                주문자
              </dt>
              <dd class="user-block__info">
                {{this.order.orderer.ordererName}}
              </dd>
            </dl>
            <dl class="user-block__row">
              <dt class="user-block__label">
                배송지 정보
              </dt>
              <dd class="user-block__info">
                <p class="delivery-info">
                  {{this.order.shippingAddress.receiverName}}
                </p>
                <p class="delivery-info">
                  {{this.order.orderer.ordererContact1}}
                </p>
                <p class="delivery-info">
                  ({{this.order.shippingAddress.receiverZipCd}}) {{this.order.shippingAddress.receiverAddress}}<br>
                  {{this.order.shippingAddress.receiverDetailAddress}}
                </p>
              </dd>
            </dl>
            <dl class="user-block__row">
              <dt class="user-block__label">
                결제 정보
              </dt>
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
              <dt class="order-block__label">
                총 주문금액
              </dt>
              <dd class="order-block__price">
                {{MyMiliForma(this.order.lastOrderAmount.standardAmt + this.order.lastOrderAmount.deliveryAmt + this.order.lastOrderAmount.remoteDeliveryAmt - this.order.lastOrderAmount.deliveryCouponDiscountAmt)}}<em>원</em>
              </dd>
            </dl>
            <div class="order-block__child">
              <dl class="order-block__row">
                <dt class="order-block__label">
                  총 상품금액
                </dt>
                <dd class="order-block__price">
                  {{MyMiliForma(this.order.lastOrderAmount.standardAmt)}}<em>원</em>
                </dd>
              </dl>
              <dl class="order-block__row">
                <dt class="order-block__label">
                  배송비
                </dt>
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
            <dl
              v-if="this.totalDiscountAmt !== 0"
              class="order-block__row title">
              <dt class="order-block__label">
                총 할인금액
              </dt>
              <dd class="order-block__price">
                -{{MyMiliForma(this.totalDiscountAmt)}}<em>원</em>
              </dd>
            </dl>
            <div class="order-block__child">
              <dl
                v-if="this.order.lastOrderAmount.immediateDiscountAmt !== 0"
                class="order-block__row">
                <dt class="order-block__label">
                  즉시 할인
                </dt>
                <dd class="order-block__price">
                  -{{MyMiliForma(this.order.lastOrderAmount.immediateDiscountAmt)}}<em>원</em>
                </dd>
              </dl>
              <dl
                v-if="isSaleExec && this.order.lastOrderAmount.additionalDiscountAmt !== 0"
                class="order-block__row">
                <dt class="order-block__label">
                  임직원 할인
                </dt>
                <dd class="order-block__price">
                  -{{MyMiliForma(this.order.lastOrderAmount.additionalDiscountAmt)}}<em>원</em>
                </dd>
              </dl>
              <dl
                v-if="this.order.lastOrderAmount.productCouponDiscountAmt !== 0"
                class="order-block__row">
                <dt class="order-block__label">
                  상품 쿠폰
                </dt>
                <dd class="order-block__price">
                  -{{MyMiliForma(this.order.lastOrderAmount.productCouponDiscountAmt)}}<em>원</em>
                </dd>
              </dl>
              <dl
                v-if="this.order.lastOrderAmount.cartCouponDiscountAmt !== 0"
                class="order-block__row">
                <dt class="order-block__label">
                  장바구니 쿠폰
                </dt>
                <dd class="order-block__price">
                  -{{MyMiliForma(this.order.lastOrderAmount.cartCouponDiscountAmt)}}<em>원</em>
                </dd>
              </dl>
            </div>
            <dl
              v-if="this.order.lastOrderAmount.subPayAmt > 0"
              class="order-block__row title"
            >
              <dt class="order-block__label">
                임직원 포인트 결제
              </dt>
              <dd class="order-block__price">
                -{{MyMiliForma(this.order.lastOrderAmount.subPayAmt)}}<em>원</em>
              </dd>
            </dl>
            <dl class="order-block__row result">
              <dt class="order-block__label">
                결제 금액
              </dt>
              <dd class="order-block__price">
                {{MyMiliForma(this.order.lastOrderAmount.chargeAmt)}}<em>원</em>
              </dd>
            </dl>
            <order-information class="information">
              마이페이지를 통해 주문내역 및 배송상태를 조회할 수 있습니다.
            </order-information>
          </div>
          <div class="complete-content__button">
            <div class="complete-content__mypage">
              <router-link to="/mypage/orderlist">
                <order-button type="mypage">
                  마이페이지 가기
                </order-button>
              </router-link>
            </div>
            <div class="complete-content__home">
              <router-link to="/">
                <order-button type="home">
                  홈으로 가기
                </order-button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OrderInformation from './OrderInfo'
import OrderButton from './OrderButton'
import PaymentConfirmNew from '@/components/mixins/order/PaymentConfirmNew'

export default {
  name: 'OrderContainer',
  components: {
    OrderButton,
    OrderInformation
  },
  mixins: [PaymentConfirmNew]
}
</script>
