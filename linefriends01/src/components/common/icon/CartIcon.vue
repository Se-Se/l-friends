<template>
  <span
    class="cart-icon"
    :class="{ 'cart-icon--active': count && count.count > 0 }"
  >
    {{ count ? count.count : 0 }}
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CartIcon',
  computed: {
    ...mapState('cart', ['count'])
  }
}
</script>

<style lang="scss" scoped>
.cart-icon {
  display: block;
  box-sizing: border-box;
  padding-top: 1.3rem;
  font-family: Volte, sans-serif;
  font-weight: 600;
  font-size: 1.3rem;
  color: #333;
  text-align: center;
  background-size: 2rem 2.6rem;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('~@/assets/images/common/cart.svg');

  &--active {
    color: #fff;
    background-image: url('~@/assets/images/common/cart-active.svg');
  }
}
</style>
