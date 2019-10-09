<template>
  <div id="container" class="wishlist">
    <Breadcrumb :title="'お気に入り'"></Breadcrumb>

    <div class="wishlist-wrap" v-if="likeProducts && likeProducts.totalCount > 0">
      <div class="wishlist-select-del-block">
        <span class="bx_input size_l" @click.prevent="allSelect">
          <input id="check_all" type="checkbox" :checked="checkAll">
          <label for="check_all">すべて選択</label>
        </span>
        <ul class="list_tools">
          <li><button class="btn btn_radius size_s" @click="likeDeleteProducts">選択した商品を削除</button></li>
        </ul>
      </div>
      <div class="wishlist-select-product-block">
        <ul class="good_list column-2">
          <li v-for="(product, key) in likeProducts" :key="key">
            <ProductItem :item="product" :isAddCheckbox="true" :selectedNos="selectedNos" @checkboxSwitch="checkboxSwitch"></ProductItem>
          </li>
        </ul>
        <mugen-scroll :handler="pageDown" :should-handle="showMugen" :offsetTop="100">
          <div id="loader" v-show="showMugen">
            <div class="loader_img"></div>
          </div>
        </mugen-scroll>
      </div>
    </div>
    <div class="wishlist-wrap" v-if="likeProducts && !likeProducts.length">
      <div class="no_data wishlist-wrap_new_padding">
        <div class="no_data_img"><img src="@/assets/img/common/img_no_data.png" alt=""></div>
        <p class="no_data_text">お気に入りに登録した商品がありません。</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Breadcrumb from '@/components/common/Breadcrumb'
import { Confirm, Alert } from '@/components/common/modal'
import { productPrice, formatCurrency } from '@/utils/StringUtils'
import MugenScroll from '@/components/common/MugenScroll'
import ProductItem from '@/components/common/ProductItem'

export default {
  name: 'LikeProducts',
  data () {
    return {
      selectedNos: [],
      currentPage: 1,
      page: this.$router.currentRoute.params.page || 1
    }
  },
  components: {
    Breadcrumb,
    MugenScroll,
    ProductItem
  },
  computed: {
    ...mapState('likeProducts', ['likeProducts']),
    checkAll () {
      return this.selectedNos.length === this.likeProducts.length
    },
    totalCount () {
      if (this.likeProducts) {
        return this.likeProducts.totalCount
      } else {
        return 0
      }
    },
    showMugen () {
      return this.likeProducts && this.likeProducts.length < this.totalCount
    }
  },
  methods: {
    pageDown () {
      this.$store.dispatch('likeProducts/getLikeProductsMore')
    },
    isNew (itemRegisterYmdt) {
      let currentDate = new Date()
      return currentDate.getTime() < this.fun_date2(itemRegisterYmdt).getTime()
    },
    fun_date2 (data) {
      let date1 = new Date(data.replace(/-/g, '/'))
      date1.setDate(date1.getDate() + 7)
      return date1
    },
    isPreOrderPeriod (product) {
      if (product && product.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(product.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(product.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    deleteLike (products) {
      this.selectedNos = products
      this.likeDeleteProducts()
    },
    async pageChange (page) {
      this.currentPage = '-1'
      await this.$store.dispatch('likeProducts/fetchLikeProducts', { pageNumber: page })

      this.selectedNos = []
    },
    priceCalculate (product) {
      return productPrice(product.salePrice,
        product.additionDiscountAmt,
        product.immediateDiscountAmt)
    },
    priceFormat (price) {
      return formatCurrency(price)
    },
    likeDeleteProducts () {
      if (this.selectedNos.length === 0) {
        Alert({
          message: '商品を選択してください。'
        })
      } else {
        Confirm({
          message: '選択された商品を削除しますか？'
        }).then((result) => {
          if (result) {
            this.$store.dispatch('likeProducts/pageLikeProducts', this.selectedNos).then(() => {
              this.selectedNos = []
              this.currentPage = 1
            })
          }
        })
      }
    },
    allSelect () {
      if (!this.checkAll) {
        this.selectedNos = []
        this.likeProducts.forEach(p => {
          this.selectedNos.push(p.productNo)
        })
      } else {
        this.selectedNos = []
      }
    },
    checkboxSwitch (productNo) {
      const findResult = this.selectedNos.find(no => no === productNo)
      if (findResult) {
        this.selectedNos = this.selectedNos.filter(item => item !== productNo)
      } else {
        this.selectedNos.push(productNo)
      }
    }
  }
}
</script>
