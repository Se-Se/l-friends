<template>
  <div>
    <sub-page-header title="장바구니" />
    <div id="container">
      <template v-if="cart && (cart.deliveryGroups.length > 0 || cart.invalidProducts.length > 0)">
        <cart-container :cart="cart" />
      </template>
      <not-found
        v-else
        description="장바구니에 담긴 상품이 없습니다"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import NotFound from '@/components/mobile/common/list/NotFound'
import CartContainer from '@/components/mobile/cart/CartContainer'

export default {
  name: 'Cart',
  components: {
    SubPageHeader,
    NotFound,
    CartContainer
  },
  computed: {
    ...mapState('cart', ['cart'])
  }
}
</script>
