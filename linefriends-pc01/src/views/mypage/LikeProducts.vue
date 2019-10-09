<template>
  <div id="container" class="mypage">
    <div class="wrap">

      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <BreadCrumbs breadCrumbs="お気に入り"></BreadCrumbs>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

      <div class="wishlist-content">
        <h1>お気に入り</h1>
        <div class="wishlist-data-area">
          <div class="wishlist-has-data" v-if="likeProducts && likeProducts.length">
            <div class="check-all cf">
              <div class="fl">
                <span class="bx_input" @click.prevent="allSelect">
                  <input id="input5" type="checkbox" :checked="checkAll">
                  <label for="input5">すべて選択</label>
                </span>
              </div>

              <div class="fr del-check-btn">
                <button @click="likeDeleteProducts">選択した商品を削除</button>
              </div>
            </div>

            <div class="wishlist-product-list">
              <ul class="good_list column-4">
                <li v-for="(product, key) in likeProducts" :key="key">
                  <ProductItem :item="product" :isAddCheckbox="true" :selectedNos="selectedNos" @checkboxSwitch="checkboxSwitch"></ProductItem>
                </li>
              </ul>
            </div>
            <pagination v-model="currentPage" :total="totalCount || 1" :limit="20" @change="pageChange(currentPage)" />

          </div>
          <div class="wishlist-no-data" v-if="likeProducts && !likeProducts.length">
            <img src="@/assets/img/order/img_none.png" alt="">
            <p class="txt">お気に入りに登録した商品がありません。</p>
          </div>

        </div>

      </div>

    </div>
    <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->

  </div>
</template>
<script>
import { mapState } from 'vuex'
import { productPrice } from '@/utils/StringUtils'
import BreadCrumbs from '@/components/common/BreadCrumbs'
import Pagination from '@/components/common/Pagination'
import { Confirm, Alert } from '@/components/common/modal'
import ProductItem from '@/components/common/ProductItem'

export default {
  name: 'LikeProducts',

  data () {
    return {
      selectedNos: [],
      currentPage: 1
      // page: this.$router.currentRoute.params.page || 1
    }
  },
  components: {
    BreadCrumbs,
    Pagination,
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
    }
  },
  methods: {
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
    },
    priceCalculate (product) {
      return productPrice(product.salePrice,
        product.additionDiscountAmt,
        product.immediateDiscountAmt)
    },
    async pageChange (page) {
      this.currentPage = page
      await this.$store.dispatch('likeProducts/fetchLikeProducts', { pageNumber: page })

      this.selectedNos = []
    }
  }
}
</script>
<style scoped>
.wishlist-content >>> .thumbnail,
.wishlist-content >>> .cart {
  cursor: pointer;
}
.wishlist-content >>> .pagination {
  margin-bottom: 120px;
}
</style>
