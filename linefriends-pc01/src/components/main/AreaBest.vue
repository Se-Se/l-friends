<template>
  <div class="wrap">
    <div class="good_area">
      <h2 class="ttl_1">たくさん買っています</h2>
      <ul class="tab_nav">
        <li :class="{'on': showIndex === 0}">
          <a href="" @click.prevent="changeTab(0)">BROWN & FRIENDS</a>
        </li>
        <li :class="{'on': showIndex === 1}">
          <a href="" @click.prevent="changeTab(1)">LINE CREATORS</a>
        </li>
        <li :class="{'on': showIndex === 2}">
          <a href="" @click.prevent="changeTab(2)">BT21</a>
        </li>
      </ul>
      <ul class="good_list column-5">
        <template v-if="products && products.brandBestProductInfos">
            <li v-for="product in showProducts" :key="`best_${product.productNo}`">
              <router-link :to="`/product/detail/${product.productNo}`">
                <div class="photo_wrap">
                  <div class="thumbnail">
                    <img class="item_img" :src="product.imageUrls[0]" alt="">
                    <img class="item_img_hover" :src="product.imageUrls[1]" alt="">
                  </div>
                </div>
                <div class="good_info">
                  <h3 class="name">{{product.productName}}</h3>
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
            </li>
          </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { priceZone } from '@/utils/StringUtils'

export default {
  props: ['products'],
  data () {
    return {
      showIndex: 0,
      showProducts: [],
      showBrands: ['BROWN_FRIENDS', 'LINE_CREATORS', 'BT21']
    }
  },
  methods: {
    changeTab (num) {
      this.showIndex = num
      if (num === 0) {
        this.showProducts = this.products.brandBestProductInfos.BROWN_FRIENDS.slice(0, 10)
      }
      if (num === 1) {
        this.showProducts = this.products.brandBestProductInfos.LINE_CREATORS.slice(0, 10)
      }
      if (num === 2) {
        this.showProducts = this.products.brandBestProductInfos.BT21.slice(0, 10)
      }
    },
    priceCalculate (product) {
      return priceZone(product)
    }
  },
  mounted () {
    this.changeTab(0)
  }
}
</script>
