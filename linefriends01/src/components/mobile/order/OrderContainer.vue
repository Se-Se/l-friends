<template>
  <div class="order-container">
    <order-item
      v-for="(item, key) in goods"
      :key="key"
      :goods="item"
      class="order__item"
    />
  </div>
</template>

<script>
import OrderItem from './OrderItem'

export default {
  name: 'OrderContainer',
  components: {
    OrderItem
  },
  props: {
    goods: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.order-container > .order__item {
  &:not(:last-child) {
    border-bottom: 1px solid #ededed;
  }
}
</style>
