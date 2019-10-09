<template>
  <div class="good_area pt-40">
    <p class="ico_new">
      <span class="badge badge_blue_2 badge_titletop">NEW</span>
    </p>
    <h2 class="ttl_1">新しく出ました</h2>
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
    <ul class="good_list column-2">
      <template v-if="products.length">
        <li v-for="product in products" :key="product.productNo">
          <router-link :to="`/m/product/detail/${product.productNo}`">
            <div class="photo_wrap">
              <span class="icon new">NEW</span>
              <div class="thumbnail">
                <img :src="product.imageUrls[0]" alt="">
              </div>
            </div>
            <div class="good_info">
              <span class="describe">{{product.promotionText}}</span>
              <h3 class="name">{{product.productName}}</h3>
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
      </template>
    </ul>
    <button class="btn btn_primary more mt-1" @click.prevent="more">
      <span class="bold">もっと見る</span>
    </button>
  </div>
</template>

<script>
import { priceZone } from '@/utils/StringUtils'

export default {
  props: ['sections'],
  data () {
    return {
      showIndex: 0,
      products: []
    }
  },
  methods: {
    changeTab (num) {
      const sectionNos = process.env.VUE_APP_MAIN_NEW_SECTIONS.split(',')
      this.showIndex = num
      this.sections.forEach(section => {
        if (section.sectionNo.toString() === sectionNos[num]) {
          this.products = section.products.slice(0, 6)
        }
      })
    },
    more () {
      const sectionNos = process.env.VUE_APP_MAIN_NEW_SECTIONS.split(',')
      this.sections.forEach(section => {
        if (section.sectionNo.toString() === sectionNos[this.showIndex]) {
          window.location = '/m' + section.sectionExplain
        }
      })
    },
    priceCalculate (product) {
      return priceZone(product)
    },
    columnClass (products) {
      if (products.length) {
        return `column-${products.length}`
      }
    }
  },
  mounted () {
    this.changeTab(0)
  }
}
</script>
