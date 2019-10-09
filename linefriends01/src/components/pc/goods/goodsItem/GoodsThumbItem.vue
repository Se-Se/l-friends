<template>
  <article class="goods-item__thumbitem">
    <router-link :to="'/goods/detail/'+goods.productNo">
      <figure class="goods-item__fig">
        <img
          :src="goods.imageUrls[0]"
          :alt="goods.productName"
          :title="goods.productName"
          :class="{ 'goods-item__fig-img': true }"
          @mouseover="overGoods()"
        >
        <img
          :src="goods.imageUrls[goods.imageUrls.length >= 2 ? 1 : 0]"
          :alt="goods.productName"
          :title="goods.productName"
          :class="{ 'goods-item__fig--over': true, over: true }"
          @mouseleave="overGoodsLeave()"
        >
      </figure>
    </router-link>
  </article>
</template>
<script>
export default {
  name: 'GoodsThumbItem',
  props: {
    goods: {
      required: false
    }
  },
  data () {
    return {
      over: false
    }
  },
  methods: {
    overGoods () {
      this.over = true
    },
    overGoodsLeave () {
      this.over = false
    }
  }
}
</script>
