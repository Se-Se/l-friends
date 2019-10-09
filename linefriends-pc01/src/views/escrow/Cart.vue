<template>
  <div id="container" class="order">
    <div class="wrap">
      <div class="order-content_list" v-if="showItems && showItems.length > 0">
        <escrow-header type="cart" />
        <cart-body :showItems="showItems" :checkedItems="checkedItems" />
        <cart-footer :calculate="calculate" :checkedItems="checkedItems" />
      </div>
      <div class="order-content_list" v-for="(showitem,index) in showReservationItems" :key="index">
        <h2>カート(予約商品)</h2>
        <cart-body-rvt :key="index+'_cartrvt'" :showItems="showitem" :checkedItems="reservationCheckedItems[index] && reservationCheckedItems[index].length > 0 ?reservationCheckedItems[index]:[] " :idx="index" v-if="showitem && showitem.length > 0" />
      </div>
      <div class="order-content_list" v-if="totalCount === 0">
        <escrow-header type="cart" />
        <cart-no-data />
      </div>
    </div>
    <best-list :list="cartBest" v-if="cartBest && cartBest.length" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import EscrowHeader from '@/components/escrow/EscrowHeader'
import CartBody from '@/components/escrow/cart/CartBody'
import CartBodyRvt from '@/components/escrow/cart/reservation/CartBodyRvt'
import CartFooter from '@/components/escrow/cart/CartFooter'
import BestList from '@/components/escrow/cart/BestList'
import CartNoData from '@/components/escrow/cart/CartNoData'
export default {
  name: 'Cart',
  computed: {
    ...mapState('cart', ['showItems', 'checkedItems', 'calculate', 'showReservationItems', 'reservationCheckedItems']),
    ...mapGetters('cart', ['haveWrappingProduct', 'totalCount']),
    ...mapState('product', ['bestProducts']),
    ...mapState('product', ['product']),
    cartBest () {
      let list = []
      let addCnt = 5
      if (!this.haveWrappingProduct && this.product) {
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
    }
  },
  components: {
    EscrowHeader,
    CartBody,
    CartFooter,
    BestList,
    CartBodyRvt,
    CartNoData
  }
}
</script>
