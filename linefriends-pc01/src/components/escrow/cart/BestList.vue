<template>
  <!-- ↓↓↓↓↓ buy_history ↓↓↓↓↓ -->
  <div class="buy_history">
    <div class="wrap">
      <h3 class="his_title">人気上昇中！</h3>
      <ul class="good_list column-5">
        <li v-for="(item, idx) in list" :key="idx">
          <product-item :item="item" />
        </li>
      </ul>
    </div>
  </div>
  <!-- ↑↑↑↑↑ buy_history ↑↑↑↑↑ -->
</template>

<script>
import ProductItem from '@/components/common/ProductItem'

export default {
  props: ['list'],
  components: {
    ProductItem
  }
}
</script>
