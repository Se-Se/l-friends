<template>
  <div class="cart-item__wrapper">
    <div class="cart-item__checkbox" v-if="!option.isInValid">
      <app-checkbox
        v-model="checkGo"
        :disabled="option.isInValid"
        :id="option.idx"
        size="large"
        @change="checkedOption"
      />
    </div>
    <div class="cart-item__container">
      <router-link :to="'/goods/detail/'+option.productNo">
        <div
          class="cart-item__thumbnail"
          :class="{ invalid: option.isInValid }"
        >
          <img :src="option.imageUrl ? option.imageUrl : 'http://image.toast.com/aaaadk/buywowdev/TEST_IMAGE(13).png?720x720'">
        </div>
      </router-link>
      <div class="cart-item">
        <ul class="goods-sticker" v-if="option.reservation">
          <li class="goods-sticker__item reserve">예약상품</li>
          <li class="datedelivery">{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}일 부터 순차 배송</li>
        </ul>
        <p class="cart-item__title">
          {{ (option.showProductName) | wordsFormat(56) }}
        </p>
        <p class="cart-item__options">
          <template v-for="(showOption, index) in option.showOptions">
            <span class="bar" v-if="index != 0">/</span> {{ showOption }}
          </template>
          <template v-if="option.showAddPrice">
            {{ option.showAddPrice }}
          </template>
        </p>
        <div class="cart-item-detail">
          <dl class="cart-item-detail__row">
            <dt>할인 적용 금액</dt>
            <dd v-if="option.isInValid">
              -
            </dd>
            <dd v-else>
              <span class="price">{{ option.showPrice }}</span>{{ $t('currency') }}
            </dd>
          </dl>
          <dl
            v-if="!option.isInValid"
            class="cart-item-detail__row child"
          >
            <dt>상품 금액</dt>
            <dd><span class="price">{{ option.showStandardAmt }}</span>{{ $t('currency') }}</dd>
          </dl>
          <dl
            v-if="!option.isInValid"
            class="cart-item-detail__row child"
          >
            <dt>할인 금액</dt>
            <dd><span class="price">{{ option.showDiscountAmt == 0 ? option.showDiscountAmt : '- ' + option.showDiscountAmt }}</span>{{ $t('currency') }}</dd>
          </dl>
          <dl class="cart-item-detail__row">
            <dt>배송비</dt>
            <dd class="free">
              <template v-if="option.isInValid">
                -
              </template>
              <template v-else-if="!option.deliverable">
                {{ option.showShippingFee }}
              </template>
              <template v-else-if="!option.free">
                {{ option.showShippingFee }}원<template v-if="option.deliveryPayType === 'PAY_ON_DELIVERY'">(착불)</template>
              </template>
              <template v-else>
                무료배송
              </template>
            </dd>
          </dl>
        </div>

        <number-spinner
          v-model="option.orderCnt"
          @input="cntSet"
        />

        <div class="cart-item__buttons">
          <app-button
            v-if="!option.isInValid"
            type="success"
            size="small"
            @click="buy"
          >
            바로구매
          </app-button>
          <app-button
            size="small"
            @click="delOption"
          >
            삭제
          </app-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import { setOrderInfoInStorage, orderProductOptionShowPriceLoad } from '@/utils/orderUtils'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import AppButton from '@/components/mobile/common/button/Button'
import NumberSpinner from '@/components/mobile/common/NumberSpinner'
import { Confirm } from '@/utils/event-bus'

export default {
  name: 'CartItem',
  components: {
    AppCheckbox,
    AppButton,
    NumberSpinner
  },
  props: ['option', 'product', 'invalid'],
  data () {
    return {
      checked: true,
      count: 1
    }
  },
  computed: {
    ...mapState('cart', ['checkOptions']),
    checkGo: {
      // getter
      get () {
        return this.checkOptions.some(item => {
          if (item.cartNo === this.option.cartNo && !this.option.isInValid) {
            return true
          }
          return false
        })
      },
      // setter
      set (newValue) {
        this.checked = newValue
      }
    }
  },
  methods: {
    ...mapMutations('cart', ['REFRESH_SHOW_AMT']),
    checkedOption () {
      const checkOption = {
        checked: this.checked,
        cartNo: this.option.cartNo,
        productNo: this.option.productNo,
        optionNo: this.option.optionNo,
        orderCnt: this.option.orderCnt,
        optionInputs: this.option.optionInputs,
        payOnDelivery: this.option.deliveryPayType === 'PAY_ON_DELIVERY'
      }
      this.$store.commit('cart/CHECK_OPTION', checkOption)
      this.$store.dispatch('cart/calculate')
    },
    changeCount: _.debounce((that, type) => {
      const carts = [JSON.parse(JSON.stringify(that.option))]
      that.$store.dispatch('cart/putCarts', carts)
    }, 500),
    async cntSet (type) {
      this.option.orderCnt = Number(this.option.orderCnt.toString().replace(/\D/g, '')) || 1
      if (this.option.orderCnt < 1) {
        this.option.orderCnt = 1
      }
      if (this.option.orderCnt > 9999) {
        this.option.orderCnt = 9999
      }
      if (this.checkGo) {
        this.checkOptions.forEach((item) => {
          if (item.cartNo === this.option.cartNo) {
            item.orderCnt = this.option.orderCnt
          }
        })
        /* 총 가격 계산 */
        this.REFRESH_SHOW_AMT()
      }
      await this.refreshOption()
      this.changeCount(this, type)
    },
    buy () {
      // TODO 추가상품번호 확인 필요.
      const products = [{
        productNo: this.option.productNo,
        optionNo: this.option.optionNo,
        orderCnt: this.option.orderCnt,
        additionalProductNo: 0,
        optionInputs: this.option.optionInputs,
        cartNo: this.option.cartNo
      }]
      setOrderInfoInStorage(products, this.$route.fullPath)
      this.$store.dispatch('ordersheet/getSheetNo', {})
    },
    delOption () {
      Confirm({
        message: this.$t('layout.cart.goodsDelConfirm'),
        callback: () => {
          const options = []
          options.push(this.option)
          this.$store.dispatch('cart/deleteCartByOptions', options)
        }
      })
    },
    refreshOption () {
      this.option = orderProductOptionShowPriceLoad(this.option)
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-item {
  width: 21.1rem;

  &.invalid > *:not(.cart-item__buttons),
  &.invalid &__title {
    opacity: 0.1;
  }

  &__wrapper {
    padding: 3.23rem 2rem 4.5rem;
  }

  &__checkbox {
    display: inline-block;
    margin-bottom: 2rem;
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

    &.invalid {
      opacity: 0.6
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
    margin-top: 0.8rem;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.43;
    letter-spacing: -0.01rem;
    color: #999;
  }

  &-detail {
    padding: 1.2rem 0 2.4rem;

    &__row {
      display: flex;
      justify-content: space-between;

      &:not(:last-child) {
        margin-bottom: 0.7rem;
      }

      dt {
        font-family: 'Noto Sans KR';
        font-size: 1.2rem;
        font-weight: bold;
        line-height: 1.67;
        letter-spacing: -0.01rem;
        color: #333;
      }

      dd {
        padding-top: 0.1rem;
        font-family: Volte, sans-serif;
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 1.67;
        letter-spacing: -0.01rem;
        color: #333;
      }

      .free {
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
      flex: 1;

      &:nth-of-type(2) {
        margin-left: 0.7rem;
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
}

</style>
