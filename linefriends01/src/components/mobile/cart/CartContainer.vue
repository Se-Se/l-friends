<template>
  <div class="cart-container">
    <div class="check-header">
      <app-checkbox
        v-model="checkAll"
        size="large"
      >
        <span class="check-all">전체 선택</span>
      </app-checkbox>
      <a
        href="#"
        class="check-delete-btn"
        style="width: 12rem"
        v-if="cart.invalidProducts.length > 0"
        @click.prevent="delInvalidOptions"
      >구매불가 일괄삭제</a>
      <a
        href="#"
        class="check-delete-btn"
        @click.prevent="delChecked"
      >선택상품 삭제</a>
    </div>

    <template v-for="deliveryGroup in cart.deliveryGroups">
      <template v-for="product in deliveryGroup.orderProducts">
        <cart-item
          v-for="option in product.orderProductOptions"
          :key="option.cartNo"
          :option="option"
          :product="product"
          class="cart__item"
        />
      </template>
    </template>

    <template v-if="cart.invalidProducts.length > 0">
      <template v-for="product in cart.invalidProducts">
        <cart-item
          v-for="option in product.orderProductOptions"
          :key="option.cartNo"
          :option="option"
          :product="product"
          class="cart__item"
          invalid
        />
      </template>
    </template>

    <cart-info />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Alert, Confirm } from '@/utils/event-bus.js'
import CartItem from './CartItem'
import CartInfo from './CartInfo'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'

export default {
  name: 'CartContainer',
  components: {
    CartItem,
    CartInfo,
    AppCheckbox
  },
  props: {
    cart: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('cart', ['checkOptions', 'invalidOptions']),
    ...mapGetters('cart', ['allChecked']),
    checkAll: {
      get () {
        return this.allChecked
      },
      set (val) {
        this.$store.commit('cart/CHECK_ALL', val)
        this.$store.dispatch('cart/calculate')
      }
    }
  },
  methods: {
    delChecked () {
      if (this.checkOptions && this.checkOptions.length > 0) {
        Confirm({
          message: this.$t('layout.cart.selectGoodsDelConfirm'),
          callback: () => {
            this.$store.dispatch('cart/deleteCartByOptions', this.checkOptions)
          }
        })
      } else {
        Alert({
          title: '장바구니',
          message: this.$t('layout.cart.selectGoods')
        })
      }
    },
    delInvalidOptions () {
      if (this.invalidOptions && this.invalidOptions.length > 0) {
        Confirm({
          message: this.$t('layout.cart.noBuy'),
          callback: () => {
            this.$store.dispatch('cart/deleteCartByOptions', this.invalidOptions)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-container > .cart__item {
  border-bottom: 1px solid #ededed;
}

.check {
  &-header {
    padding: 1.6rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ededed;
  }

  &-all {
    display: inline-block;
    margin-left: 1.2rem;
    margin-top: 0.1rem;
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    font-weight: normal;
    line-height: 1.25;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &-delete-btn {
    border: 1px solid #ddd;
    border-radius: 1.4rem;
    width: 8.8rem;
    height: 2.8rem;
    padding-top: 0.4rem;
    text-align: center;
    font-family: 'Noto Sans KR';
    font-size: 1.2rem;
    font-weight: 500;
    line-height: normal;
    color: #666;
  }
}
</style>
