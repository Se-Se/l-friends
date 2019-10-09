<template>
  <div class="table_wrap">
    <table class="table_data item bor_top-1">
      <caption class="blind">{{ $t('layout.cart.cartList') }}</caption>
      <colgroup>
        <col class="width-5p">
        <col class="width-45p">
        <col class="width-13p">
        <col class="width-15p">
        <col class="width-12p">
        <col class="width-10p">
      </colgroup>
      <cart-table-header />
      <CartTableBodyNew :cart="cart" />
    </table>
  </div>
</template>

<script>
import CartTableHeader from '@/components/pc/layout/cart/CartTableHeader'
import CartTableBodyNew from '@/components/pc/layout/cart/CartTableBodyNew'
import { mapState } from 'vuex'

export default {
  components: {
    CartTableHeader,
    CartTableBodyNew
  },
  computed: {
    checkAllGo: {
      // getter
      get () {
        return this.allChecked
      },
      // setter
      set (newValue) {
        this.mychecked = newValue
      }
    },
    ...mapState('cart', ['cart'])
  },
  watch: {
    cart () {
      if (this.cart.deliveryGroups && this.cart.deliveryGroups.length > 0) {
        let cart = 0
        this.cart.deliveryGroups.map((item) => {
          cart += item.orderProducts.length
        })
        document.title = this.$route.meta.title + '(' + cart + ')' + ' - LINE FRIENDS'
      }
    }
  }
}
</script>
