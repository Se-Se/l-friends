<template>
  <router-link :to="`/goods/detail/${ product.productNo }`">
    <div class="today_list_img">
      <p class="list_img-img">
        <product-img :image="product.listImageUrls && product.listImageUrls[0]" :stockCnt="product.stockCnt" style="height: 160px !important;"></product-img>
      </p>
      <span class="list_img-ico" v-if="isDiscount">{{ discountPercent }}%</span>
    </div>
    <div class="today_list_info">
      <router-link :to="`/brand/${ product.brandNo }`" v-if="product.brandName">
        <span class="brand">{{product.brandName}}</span>
      </router-link>
      <span class="brand" v-else></span>
      <span class="tit">{{product.productName | wordsFormat(26)}}</span>
      <span class="bx_price" v-if="isLogined">{{totalSale | formatCurrency}}<span class="txt">원</span></span>
    </div>
  </router-link>
</template>
<script>
import ProductImg from '@/components/pc/layout/common/ProductImgNew'
export default {
  props: {
    product: {
      type: Object,
      default: function () {
        return {
          salePrice: 0,
          additionDiscountAmt: 0,
          immediateDiscountAmt: 0
        }
      }
    }
  },
  components: {
    ProductImg
  },
  computed: {
    isLogined () {
      return this.$store.getters.isLogined
    },
    totalSale () {
      return this.product.salePrice - this.discountAmt
    },
    discountAmt () {
      return (this.product.immediateDiscountAmt || 0)
    },
    discountPercent () {
      return Math.round((this.discountAmt / this.product.salePrice) * 100)
    },
    isDiscount () {
      return this.discountAmt > 0 && this.discountPercent > 0
    }
  }
}
</script>
