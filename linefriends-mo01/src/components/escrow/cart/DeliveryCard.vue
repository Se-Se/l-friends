<template>
  <div>
    <div class="cart_main">
      <cart-item v-for="(item, idx) in delivery.items" :key="idx" :option="item" :checkedItems="checkedItems" />
    </div>
    <div class="temp_total" v-if="delivery.deliveryCondition">
      <p class="temp_total_prize">￥<span class="total_num">{{delivery.buyAmt | formatCurrency}}</span> +
        ￥<span class="total_num">{{delivery.deliveryCondition.deliveryAmt | formatCurrency}}</span> (送料) =
        ￥<span class="total_num">{{(delivery.buyAmt + delivery.deliveryCondition.deliveryAmt) | formatCurrency}}</span></p>
      <p class="temp_total_txt">送料は東京基準となっており、 <br>
        配送地域によって異なります。</p>
    </div>
  </div>
</template>

<script>
import CartItem from '@/components/escrow/cart/CartItem'

export default {
  props: ['delivery', 'checkedItems'],
  components: {
    CartItem
  }
}
</script>
