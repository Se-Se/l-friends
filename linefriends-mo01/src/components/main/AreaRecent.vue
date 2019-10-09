<template>
  <div class="record_area">
    <h2 class="ttl_1">最近見た商品</h2>
    <p class="ttl_sub">お客様のために準備しました</p>
    <div class="good_roller">
      <ul class="good_list slick" :style="{width: `calc(20.9rem * ${products.length})`}">
        <li v-for="(product, idx) in products" :key="`${idx}_${product.productNo}`">
          <router-link :to="`/m/product/detail/${product.productNo}`">
            <div class="photo_wrap">
              <span class="icon best">BEST</span>
              <div class="thumbnail">
                <img :src="product.imageUrls[0]" alt="">
              </div>
            </div>
            <div class="good_info">
              <span class="describe">{{ product.promotionText }}</span>
              <h3 class="name">{{ product.productName }}</h3>
              <p class="price">
                <strong class="discount" v-if="priceCalculate(product).discountRate">{{priceCalculate(product).discountRate}}% OFF</strong>
                <span class="real">￥{{priceCalculate(product).finalSalePrice.toLocaleString()}}</span>
                <del class="original" v-if="priceCalculate(product).discountRate">{{product.salePrice.toLocaleString()}}</del>
              </p>
              <p class="ohter" v-if="priceCalculate(product).couponRate || product.reservationData">
                <span class="badge badge_blue" v-if="priceCalculate(product).couponRate">クーポン</span>
                <span class="badge badge_reserved" v-if="product.reservationData">予約商品</span>
              </p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { priceZone } from '@/utils/StringUtils'

export default {
  props: ['products'],
  methods: {
    priceCalculate (product) {
      return priceZone(product)
    }
  }
}
</script>
