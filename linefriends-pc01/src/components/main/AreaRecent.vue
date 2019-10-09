<template>
  <div class="hot_area">
    <div class="hot_area_con">
      <h2 class="ttl_1">注目されています</h2>
      <p class="ttl_sub">最近見た商品 </p>
      <slick class="browse_records cf" v-if="products" :options="slickOptions">
        <div class="good_list banner" v-for="(product, idx) in products" :key="`recent_${idx}_${product.productNo}`">
          <router-link :to="`/product/detail/${product.productNo}`">
            <div class="photo_wrap">
              <div class="thumbnail">
                <img class="item_img" :src="product.imageUrls[0]" alt="">
                <img class="item_img_hover" :src="product.imageUrls[1]" alt="">
              </div>
            </div>
            <div class="good_info">
              <span class="describe">{{ product.promotionText }}</span>
              <h3 class="name">{{ product.productName }}</h3>
              <p class="price">
                <strong class="discount" v-if="priceCalculate(product).discountRate">{{priceCalculate(product).discountRate}}% OFF</strong>
                <span class="real"><i class="uom">￥</i>{{priceCalculate(product).finalSalePrice.toLocaleString()}}</span>
                <del class="original" v-if="priceCalculate(product).discountRate">{{product.salePrice.toLocaleString()}}</del>
              </p>
              <p class="ohter" v-if="priceCalculate(product).couponRate || product.reservationData">
                <span class="badge badge_blue" v-if="priceCalculate(product).couponRate">{{priceCalculate(product).couponRate}}% OFF クーポン</span>
                <span class="badge badge_reserved" v-if="product.reservationData">予約商品</span>
              </p>
            </div>
          </router-link>
        </div>
      </slick>
    </div>
  </div>
</template>

<script>
import Slick from 'vue-slick'
import { priceZone } from '@/utils/StringUtils'

export default {
  props: ['products'],
  data () {
    return {
      slickOptions: {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: 'linear',
        slidesToShow: 3
      }
    }
  },
  components: {
    Slick
  },
  methods: {
    priceCalculate (product) {
      return priceZone(product)
    }
  }
}
</script>
