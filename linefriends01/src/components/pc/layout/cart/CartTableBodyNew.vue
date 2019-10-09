<template>
  <tbody>
    <!-- [D] 장바구니 빈 경우 : td에 no_data 클래스 추가 -->
    <!-- cart table component S 데이터가 있을 경우의 컴포넌트, 없을 경우의 컴포넌트 나눠야함.-->
    <template v-if="loading">
      <td colspan="6">
        <img
          src="https://t1.daumcdn.net/cfile/tistory/184F8A4E4E55932B06"
          style="width:100px; margin:20px 0;"
        />
      </td>
    </template>
    <template v-else-if="isDeliveryGroups || isInvalidProducts">
      <template v-if="cart.deliveryGroups.length > 0">
        <template v-for="deliveryGroup in cart.deliveryGroups">
          <template v-for="product in deliveryGroup.orderProducts">
            <CartOptionNew v-for="option in product.orderProductOptions" :key="option.cartNo" :option="option" :product="product" />
          </template>
        </template>
      </template>
      <template v-if="cart.invalidProducts.length > 0">
        <template v-for="product in cart.invalidProducts">
          <CartOptionNew v-for="option in product.orderProductOptions" :key="option.cartNo" :option="option" :product="product" />
        </template>
      </template>
    </template>
    <cart-empty v-else/>
    <!-- cart table component E -->
  </tbody>
</template>

<script>
import CartOptionNew from '@/components/pc/layout/cart/CartOptionNew'
import CartEmpty from '@/components/pc/layout/cart/CartEmpty'
import { mapGetters, mapState } from 'vuex'

export default {
  props: ['cart'],
  components: {
    CartOptionNew,
    CartEmpty
  },
  data () {
    return {
      myList: []
    }
  },
  computed: {
    ...mapGetters('cart', ['isDeliveryGroups', 'isInvalidProducts']),
    ...mapState('cart', ['loading'])
  }
}
</script>