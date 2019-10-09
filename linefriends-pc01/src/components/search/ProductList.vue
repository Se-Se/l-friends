<template>
  <div class="list-product-block">
    <ul class="good_list column-4">
      <li v-for="(item, key) in list" :key="key">
        <product-item :item="item" />
      </li>
    </ul>
  </div>
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
