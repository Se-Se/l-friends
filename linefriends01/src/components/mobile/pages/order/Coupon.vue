<template>
  <div>
    <sub-page-header
      title="쿠폰적용"
      close
      :onClose="closeCouponPopup"
    />
    <div
      id="container"
      v-if="orderCoupons"
    >
      <div class="coupon-content">
        <div class="coupon-content__header">
          <h3 class="coupon-content__title">
            상품 쿠폰 적용
          </h3>
          <a
            :class="['coupon-content__max', resetBtnFlg ? '' : 'active']"
            href="#"
            @click.prevent="toggleMax"
          >
            {{ resetBtnFlg ? '최대할인 해제' : '최대할인 적용' }}
          </a>
        </div>
        <div
          v-if="showProductInfos"
          class="coupon-info"
        >
          <template v-for="(product, key) in orderCoupons.products">
            <div
              v-if="product.productCoupons && product.productCoupons.length"
              :key="key"
              class="coupon-info__item"
            >
              <coupon-product
                :product="product"
                :coupon-request="couponRequestCopy"
              />
            </div>
          </template>
        </div>
        <not-found
          v-else
          :height="21.833"
          :bottom="0.7"
          description="적용 가능한 쿠폰이 없습니다."
          :friend="false"
        />
      </div>
      <div class="coupon-content">
        <div class="coupon-content__header">
          <h3 class="coupon-content__title">
            장바구니/배송비 쿠폰 적용
          </h3>
        </div>
        <div
          v-if="showCartAndDelivery"
          class="coupon-info"
        >
          <coupon-cart-and-delivery
            :cartCoupons="commonCartCoupons"
            :deliveryCoupons="commonDeliveryCoupons"
          />
        </div>
        <not-found
          v-else
          :height="21.833"
          :bottom="0.7"
          description="적용 가능한 쿠폰이 없습니다."
          :friend="false"
        />
      </div>
      <div class="coupon-sale-info">
        <dl class="coupon-sale-info__item">
          <dt class="coupon-sale-info__name">총 상품 할인 금액</dt>
          <dd class="coupon-sale-info__value"><span class="price">{{ productAmt | formatNumber }}</span>원</dd>
        </dl>
        <dl class="coupon-sale-info__item">
          <dt class="coupon-sale-info__name">장바구니 할인 금액</dt>
          <dd class="coupon-sale-info__value"><span class="price">{{ cartAmt | formatNumber }}</span>원</dd>
        </dl>
        <dl class="coupon-sale-info__item">
          <dt class="coupon-sale-info__name">배송비 할인 금액</dt>
          <dd class="coupon-sale-info__value"><span class="price">{{ deliveryAmt | formatNumber }}</span>원</dd>
        </dl>
        <dl class="coupon-sale-info__item sale-price">
          <dt class="coupon-sale-info__name">총 할인 금액</dt>
          <dd class="coupon-sale-info__value"><span class="price">{{ totalAmt | formatNumber }}</span>원</dd>
        </dl>
        <div class="coupon-button">
          <app-button
            type="success"
            @click="couponApply"
          >
            확인
          </app-button>
        </div>
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppFooter from '@/components/mobile/layout/footer/Footer'
import NotFound from '@/components/mobile/common/list/NotFound'
import AppButton from '@/components/mobile/common/button/Button'
import CouponProduct from '@/components/mobile/order/coupon/CouponProduct'
import CouponCartAndDelivery from '@/components/mobile/order/coupon/CouponCartAndDelivery'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  name: 'Coupon',
  components: {
    SubPageHeader,
    AppFooter,
    NotFound,
    AppButton,
    CouponProduct,
    CouponCartAndDelivery
  },
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo
    }
  },
  computed: {
    ...mapGetters('ordersheet', ['orderCouponDisplayModel']),
    ...mapState('ordersheet', ['orderCoupons']),
    ...mapState('ordersheet', ['couponRequestCopy', 'usePaycoCoupon']),
    ...mapGetters('ordersheet', ['resetBtnFlg']),
    display () {
      return this.orderCouponDisplayModel || {}
    },
    commonCartCoupons () {
      if (this.display.hasCommonCartCoupon) {
        return this.orderCoupons.cartCoupons
      }
      return []
    },
    commonDeliveryCoupons () {
      if (this.display.hasCommonDeliveryCoupon) {
        return this.orderCoupons.deliveryCoupons
      }
      return []
    },
    showProductInfos () {
      let showFlg = false
      this.orderCoupons.products.forEach(item => {
        if (!showFlg) {
          if (this.haveCoupons(item)) {
            showFlg = true
          }
        }
      })
      return showFlg
    },
    showCartAndDelivery () {
      return this.commonCartCoupons.length > 0 || this.commonDeliveryCoupons.length > 0
    },
    productAmt () {
      return this.orderCoupons ? this.orderCoupons.productCouponDiscountAmt : 0
    },
    cartAmt () {
      return this.orderCoupons ? this.orderCoupons.cartCouponDiscountAmt : 0
    },
    deliveryAmt () {
      return this.orderCoupons ? this.orderCoupons.deliveryCouponDiscountAmt : 0
    },
    totalAmt () {
      return this.productAmt + this.cartAmt + this.deliveryAmt
    }
  },
  methods: {
    toggleMax () {
      if (this.resetBtnFlg) {
        this.$store.dispatch('ordersheet/resetConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequestCopy })
      } else {
        this.$store.dispatch('ordersheet/maxCalculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequestCopy })
      }
    },
    showBrandName (product) {
      if (product.brandName) {
        product.brandName = '[' + product.brandName + ']'
      }
      return product.brandName
    },
    haveCoupons (item) {
      return item && ((item.productCoupons && item.productCoupons.length) || (item.productPlusCoupons && item.productPlusCoupons.length))
    },
    closeCouponPopup () {
      this.$store.commit('ordersheet/COPY_COUPONREQUEST')
      this.$emit('close')
    },
    couponApply () {
      const _this = this
      this.$store.dispatch('ordersheet/applyCouponOrder', { orderSheetNo: this.orderSheetNo }).then(() => {
        _this.$store.commit('ordersheet/CHANGE_COUPONREQUEST')
        _this.$store.commit('ordersheet/COPY_COUPONREQUEST')
        _this.$store.commit('ordersheet/SET_USE_PAYCOCOUPON')
        if (_this.usePaycoCoupon) {
          // alert('PAYCO 결제 전용 할인 쿠폰 적용완료되었습니다. PAYCO로 결제 진행 됩니다.')
          Alert({
            message: 'PAYCO 결제 전용 할인 쿠폰 적용완료되었습니다. PAYCO로 결제 진행 됩니다.'
          })
          _this.$emit('close')
        } else {
          _this.$emit('close')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 3.6rem 0 4rem;
}

.coupon-content {
  padding: 0 2rem 0;

  &:not(:first-child) {
    padding-top: 3.2rem;
    border-top: 1px solid #ededed;
  }

  &__footer {
    margin-bottom: 3.7rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__max {
    display: block;
    height: 2.8rem;
    padding: 0 1rem;
    border: 1px solid #ddd;
    font-family: 'Noto Sans KR';
    font-size: 1.2rem;
    font-weight: 500;
    line-height: 2.6rem;
    letter-spacing: -0.01rem;
    color: #666;
    background: #fff;
    border-radius: 1.4rem;

    &.active {
      border-color: #00d664;
      background: #00d664;
      color: #fff;
    }
  }

  &__title {
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    font-weight: bold;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;
  }
}

/deep/ .coupon-info {
  padding-top: 0.83rem;

  &__item {
    &:not(:last-child) {
      border-bottom: 1px solid #ededed;
    }
  }

  &__row {
    margin-top:3.2rem;
    &:not(:last-child) {
      margin-bottom: 3.2rem;
    }

    &.inline {
      display: flex;
      justify-content: space-between;
      margin-bottom: -0.1rem;
      padding-bottom: 3.2rem;
      border-bottom: 1px solid #ededed;

      .coupon-info__label {
        font-family: 'Noto Sans KR';
        font-size: 1.4rem;
        font-weight: normal;
        line-height: 1.43;
        letter-spacing: -0.01rem;
        color: #333;
      }

      .coupon-info__value {
        font-family: 'Noto Sans KR';
        font-size: 1.4rem;
        font-weight: 600;
        line-height: 1.25;
        letter-spacing: -0.01rem;
        color: #00d664;

        .price {
          font-family: Volte, sans-serif;
          font-size: 1.6rem;
          font-weight: 600;
        }
      }
    }
  }

  &__value {
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #333;
  }
}

.coupon-sale-info {
  padding: 3.3rem 2rem 0;
  border-top: 1px solid #ededed;

  &__item {
    display: flex;
    justify-content: space-between;

    &:not(:first-child) {
      margin-top: 1rem;
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

    &.sale-price {
      margin-top: 2.4rem;

      dt {
        margin-top: 0.9rem;
      }

      dd {
        color: #ff414e;
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

.coupon-button {
  margin-top: 3.5rem;
}
</style>
