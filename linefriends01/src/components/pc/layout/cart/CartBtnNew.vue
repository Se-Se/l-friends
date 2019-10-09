<template>
  <div class="btn_order">
    <button type="button" class="btn btn_pink btn_radius-box" @click="buyChecked">{{ $t('layout.cart.cartBtnNew') }}</button>
  </div>
</template>

<script>
import CartBtnNew from '@/components/mixins/cart/CartBtnNew'

export default {
  name: 'CartBtnNew',
  mixins: [CartBtnNew]
}
</script>
