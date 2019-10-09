<template>
  <div v-if="order">
    <sub-page-header title="주문 상세" />

    <div id="container">
      <div class="order-block__wrapper">
        <div class="order-block-goods order-info__wrapper list">
          <div class="order-header">
            <div>
              <p class="order-date">
                {{ order.orderYmdt.substring(0,10) }}
              </p>
              <p class="order-no">
                {{ $t('order.number')}} : {{ order.orderNo }}
              </p>
            </div>
          </div>
          <template v-for="(partner, pk) in order.orderOptionsGroupByPartner">
            <template v-for="(delivery, dk) in partner.orderOptionsGroupByDelivery">
                <template v-for="(option, ok) in delivery.orderOptions">
                  <order-option
                    :key="`${pk}${dk}${ok}`"
                    :option="option"
                    @showAddReviewPopup="option => openReview(option)"
                  />
                </template>
            </template>
          </template>
        </div>

        <div class="order-block" v-if="order.showPriceInfo">
          <div class="order-block__header">
            <h3 class="order-block__title">
              결제 정보
            </h3>
          </div>
          <dl class="order-block__row">
            <dt class="order-block__label">
              총 주문금액
            </dt>
            <dd class="order-block__value price">
              {{ order.showPriceInfo.payAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
            </dd>
          </dl>
          <div class="order-block__child">
            <dl class="order-block__row">
              <dt class="order-block__label">
                총 상품금액
              </dt>
              <dd class="order-block__value price">
                {{ order.showPriceInfo.standardAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
              </dd>
            </dl>
            <dl class="order-block__row">
              <dt class="order-block__label">
                총 배송비
              </dt>
              <dd class="order-block__value price">
                {{ order.showPriceInfo.deliveryAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
              </dd>
            </dl>
          </div>
          <dl class="order-block__row">
            <dt class="order-block__label">
              총 할인금액
            </dt>
            <dd class="order-block__value price">
              -{{ order.showPriceInfo.totalDisAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
            </dd>
          </dl>
          <dl class="order-block__row" v-if="isExec">
            <dt class="order-block__label">
              임직원 포인트
            </dt>
            <dd class="order-block__value price">
              -{{ order.showPriceInfo.subPayAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
            </dd>
          </dl>
          <dl class="order-block__row bottom">
            <dt class="order-block__label">
              총 결제금액
            </dt>
            <dd class="order-block__value price total">
              {{ order.showPriceInfo.chargeAmt | formatCurrency }}<span class="currency">{{ $t('currency') }}</span>
            </dd>
          </dl>
          <dl class="order-block__row pay-method">
            <dt class="order-block__label">
              결제수단
            </dt>
            <dd class="order-block__value">
              {{ order.payTypeLabel === '적립금 전액 사용' ? '임직원 포인트' : order.payTypeLabel }}{{ order.payInfo && order.payInfo.cardInfo ? ' ' + order.payInfo.cardInfo.installmentLabel : '' }}<br>
              <template v-if="order.payInfo && order.payInfo.cardInfo">
                {{ order.payInfo.cardInfo ? order.payInfo.cardInfo.cardName : '' }}
                <i class="num">{{ order.payInfo.cardInfo ? order.payInfo.cardInfo.cardNo : '' }}</i>
              </template>
            </dd>
          </dl>
          <div
            v-if="order.payType === 'VIRTUAL_ACCOUNT'"
            class="order-block__child"
          >
            <dl class="order-block__row pay-method">
              <dt class="order-block__label">
                입금은행
              </dt>
              <dd class="order-block__value">
                {{order.payInfo.bankInfo.bankName}}
              </dd>
            </dl>
            <dl class="order-block__row pay-method">
              <dt class="order-block__label">
                입금계좌
              </dt>
              <dd class="order-block__value">
                {{order.payInfo.bankInfo.account}}
              </dd>
            </dl>
            <dl class="order-block__row pay-method">
              <dt class="order-block__label">
                입금기한
              </dt>
              <dd class="order-block__value">
                {{ order.payInfo.bankInfo.paymentExpirationYmdt | dateFormatStr('yyyy-MM-dd HH:mm') }}
              </dd>
            </dl>
          </div>
        </div>

        <!-- <div class="order-block">
          <div class="order-block__header">
            <h3 class="order-block__title">
              구매자 정보
            </h3>
          </div>
          <dl class="order-block__row">
            <dt class="order-block__label">
              구매자
            </dt>
            <dd class="order-block__value">
              {{ order.orderer.ordererName }}
            </dd>
          </dl>
          <dl class="order-block__row">
            <dt class="order-block__label">
              휴대전화
            </dt>
            <dd class="order-block__value">
              {{ order.orderer.ordererContact1 }}
            </dd>
          </dl>
          <dl class="order-block__row">
            <dt class="order-block__label">
              이메일
            </dt>
            <dd class="order-block__value">
              {{ order.orderer.ordererEmail }}
            </dd>
          </dl>
        </div> -->
        <div
          v-if="order.showPriceInfo && order.refundInfos && order.refundInfos.length > 0"
          class="order-block"
        >
          <div class="order-block__header">
            <h3 class="order-block__title">
              환불 정보
            </h3>
          </div>
          <refund-info :refund-infos="order.refundInfos" />
        </div>
        <div class="order-block">
          <div class="order-block__header">
            <h3 class="order-block__title">
              배송지 정보
            </h3>
            <div>
              <a
                v-if="shippingAddress.showButtonFlg"
                href="#"
                class="update-delivery"
                @click.prevent="showAddressPopup = true"
              >배송지 정보 변경</a>
            </div>
          </div>
          <dl class="order-block__row">
            <dt class="order-block__label">
              받는사람
            </dt>
            <dd class="order-block__value">
              {{ shippingAddress.receiverName }}
            </dd>
          </dl>
          <dl class="order-block__row">
            <dt class="order-block__label">
              주소
            </dt>
            <dd class="order-block__value">
              <span class="num">{{ shippingAddress.receiverZipCd }}</span>{{ shippingAddress.receiverAddress }} {{ shippingAddress.receiverDetailAddress }}
            </dd>
          </dl>
          <dl class="order-block__row">
            <dt class="order-block__label">
              휴대전화
            </dt>
            <dd class="order-block__value">
              {{ shippingAddress.receiverContact1 }}
            </dd>
          </dl>
          <dl class="order-block__row">
            <dt class="order-block__label">
              배송메모
            </dt>
            <dd class="order-block__value">
              {{ shippingAddress.deliveryMemo }}
            </dd>
          </dl>

          <comment
            v-if="shippingAddress.showLabelFlg"
            class="comment"
          >
            상품/배송준비중 상태인 경우 배송지 직접 변경이 불가하오니 변경을 원하실 경우 <router-link class="link-blue" to="mypage/">1:1</router-link> 문의를 이용해 주세요. 
          </comment>

          <div class="order-block__button">
            <app-button
              type="success"
              @click="$router.go(-1)"
            >
              목록
            </app-button>
          </div>
        </div>
      </div>
    </div>
    <transition
      v-if="shippingAddress.showButtonFlg"
      name="address-input-popup"
    >
      <div
        v-if="showAddressPopup"
        ref="AddressInputPopup"
        class="address-input-popup"
      >
        <order-detail-address
          ref="orderDetailAddress"
          :orderNo="order.orderNo"
          :shippingAddress="shippingAddress"
          :requireCustomsIdNumber="!!shippingAddress.customsIdNumber"
          :nonMember="!isLogined"
          @close="showAddressPopup = false"
          @select-address="selectAddress"
        />
      </div>
    </transition>

    <transition name="review-popup">
      <div
        v-show="regist"
        class="review-popup__wrapper"
      >
        <add-review
          ref="ReviewPopup"
          class="review-popup"
          mode="WRITE"
          :review="product"
          @close="reviewClose"
          @save="$store.dispatch('myorder/getOrderDetail', $route.params.orderNo)"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import $ from 'jquery'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import OrderOption from '@/components/mobile/order/OrderOption'
import AppButton from '@/components/mobile/common/button/Button'
import Comment from '@/components/mobile/common/Comment'
import OrderDetailAddress from './OrderDetailAddressNew'
import OrderDetailNew from '@/components/mixins/mypage/order/detail/OrderDetailNew'
import AddReview from '@/components/mobile/pages/mypage/review/leaf/AddReviewNew'
import RefundInfo from '@/components/mobile/pages/mypage/order/common/RefundInfoNew'

const $elem = $('html, body')

export default {
  name: 'OrderDetailNew',
  mixins: [OrderDetailNew],
  components: {
    SubPageHeader,
    OrderDetailAddress,
    OrderOption,
    AppButton,
    Comment,
    AddReview,
    RefundInfo
  },
  data () {
    return {
      showAddressPopup: false,
      product: {},
      regist: false
    }
  },
  watch: {
    regist (next) {
      if (next) {
        disablePageScroll(this.$refs.ReviewPopup.$el)
        $elem.css('overflow', 'hidden')
      } else {
        enablePageScroll(this.$refs.ReviewPopup.$el)
        $elem.css('overflow', '')
      }
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    ...mapState('myorder', ['order']),
    ...mapGetters('profile', ['isExec']),
    shippingAddress () {
      return this.order.shippingAddress
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.regist) {
      this.regist = false
      next(false)
    } else {
      next()
    }
  },
  beforeUpdate () {
    if (this.order) {
      for (let partner of this.order.orderOptionsGroupByPartner) {
        for (let delivery of partner.orderOptionsGroupByDelivery) {
          delivery.orderOptions = delivery.orderOptions.sort((a, b) => {
            return a.claimNo - b.claimNo
          })

          delivery.orderOptions = delivery.orderOptions.map((item, key) => {
            return {
              ...item,
              showButton: key === delivery.orderOptions.length - 1 || delivery.orderOptions[key + 1].claimNo !== item.claimNo || item.claimNo === null
            }
          })
        }
      }
    }
  },
  methods: {
    selectAddress () {
    },
    openReview (product) {
      this.product = product
      this.regist = true
    },
    reviewClose () {
      this.regist = false
    }
  }
}
</script>

<style lang="scss" scoped>
.link-blue {
  color:#4ba4d9;
  text-decoration: underline;
}

.comment {
  margin-top: 5.2rem;
}

.update-delivery {
  display: inline-block;
  margin-bottom: 2.4rem;
  padding: 0.4rem 1.1rem;
  border-radius: 5rem;
  background: #fff;
  border: 1px solid #ddd;
  font-family: 'Noto Sans KR';
  font-size: 1.2rem;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.01rem;
  color: #666;
}

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
    font-size: 1.4rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #999;

    &::after {
      content: '';
      display: inline-block;
      vertical-align: top;
      width: 1.8rem;
      height: 1.8rem;
      margin-top: 0.2rem;
      background-size: 100% 100%;
      background-image: url(~@/assets/images/mobile/ic-small-arrow.svg);
      margin-right: -0.6rem;
    }
  }

  &-info {
    &__wrapper {
      padding: 0 2rem;

      &.status .order-info {
        margin-top: 3.6rem;
      }
    }
  }
}

/deep/ .order-block {
  padding: 3.1rem 2rem 3.3rem;

  &:not(:last-child) {
    border-bottom: 1px solid #ededed;
  }

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    font-weight: bold;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;
    margin-bottom: 2rem;
  }

  &-goods {
    margin-top: 2.6rem;
    padding-bottom: 3.6rem;
    border-bottom: 1px solid #ededed;
  }

  &__row {
    display: flex;
    justify-content: space-between;

    &.bottom {
      align-items: flex-end;
    }

    &:not(:last-child) {
      margin-bottom: 0.8rem;
    }

    &.pay-method {
      padding-top: 0.4rem;
    }
  }

  &__label {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: 3333;
  }

  &__value {
    max-width: 22.4rem;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.6;
    letter-spacing: -0.01rem;
    color: #333;
    text-align: right;
    word-break: keep-all;

    &.price {
      font-family: Volte, sans-serif;
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 1.25;

      .currency {
        font-family: 'Noto Sans KR';
        font-size: 1.4rem;
        font-weight: bold;
        letter-spacing: normal;
      }
    }

    &.total.price {
      margin-top: 1.4rem;
      margin-bottom: 0.4rem;
      font-size: 2.4rem;
      color: #ff414e;
      line-height: 0.71;

      .currency {
        font-size: 2rem;
      }
    }
  }

  &__child {
    margin-bottom: 2.2rem;

    .order-block {
      &__label, &__value {
        color: #999;
      }
    }
  }

  &__button {
    padding: 1.2rem 0 0.7rem;
  }

  &__row + &__button {
    padding-top: 3.1rem;
  }
}

.address-input-popup {
  position: fixed;
  z-index: 1005;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background: #fff;

  &-enter-active, &-leave-active {
    transition: .3s;
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(5rem);
  }
}

.review-popup {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  &__wrapper {
    position: fixed;
    z-index: 1005;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  &-enter-active, &-leave-active {
    transition: .3s;
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(5rem);
  }
}
</style>
