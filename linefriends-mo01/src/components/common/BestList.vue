<template>
  <div :class="bodyClass" v-if="showBest">
    <template v-if="type === 'cart'">
      <h3 class="ttl_h3">人気上昇中！</h3>
      <div class="good_roller">
        <ul class="good_list slick" :style="`width: calc(20.9rem * ${showBest.length});`">
          <li v-for="(item, idx) in showBest" :key="idx">
            <product-item :item="item" />
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <h2 class="result-product-buying-title">人気上昇中！</h2>
      <div class="record_area result-p_t_1_2">
        <div class="good_roller">
          <ul class="good_list slick  result-p_l_0" :style="`width: calc(20.9rem * ${showBest.length})`">
            <li v-for="(item, key) in showBest" :key="key">
              <product-item :item="item" />
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import ProductItem from '@/components/common/ProductItem'

export default {
  props: ['type'],
  components: {
    ProductItem
  },
  computed: {
    ...mapGetters('cart', ['haveWrappingProduct']),
    ...mapState('product', ['bestProducts']),
    ...mapState('product', ['product']),
    showBest () {
      let list = []
      let addCnt = 5
      if (this.type === 'cart' && !this.haveWrappingProduct && this.product) {
        let tempItem = {
          productNo: this.product.baseInfo.productNo,
          mainBestProductYn: this.product.mainBestProductYn,
          registerYmdt: this.product.baseInfo.registerYmdt,
          imageUrls: this.product.baseInfo.imageUrls,
          productName: this.product.baseInfo.productName,
          promotionText: this.product.baseInfo.promotionText,
          salePrice: this.product.price.salePrice,
          immediateDiscountAmt: this.product.price.immediateDiscountAmt,
          reservationData: this.product.reservationData
        }
        list.push(tempItem)
        addCnt = 4
      }
      if (this.bestProducts) {
        list.push(...this.bestProducts.filter((item, idx) => idx < addCnt))
      }
      return list
    },
    bodyClass () {
      if (this.type === 'cart') {
        return 'recommend'
      } else {
        return 'result-product-buying-block'
      }
    }
  }
}
</script>
