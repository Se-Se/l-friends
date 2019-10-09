<template>
  <router-link :to="'/m/product/detail/' + item.productNo">
    <div class="photo_wrap" :class="item.imageUrls[0] ? '' : 'product_list_text'">
      <span v-if="item.mainBestProductYn" class="icon best">BEST</span>
      <span v-if="isNew(item.registerYmdt) && !item.mainBestProductYn" class="icon new">NEW</span>
      <span v-if="item.stickerInfos && item.stickerInfos[0].label==='MD推薦'" class="icon recommendation">おすすめ</span>
      <span v-if="isLittle" class="icon more">あとわずか</span>
      <div class="thumbnail" :class="isSoldOut ? 'product-sell-out' : ''">
        <img :src="item.imageUrls[0]" :alt="item.name" :title="item.name">
      </div>
      <span v-if="isShowCart" class="cart" @click.prevent="pushToCart(item)">cart</span>
    </div>
    <div class="good_info">
      <span v-if="item.promotionText" class="describe">{{ item.promotionText }}</span>
      <h3 class="name">{{ item.productName | bytesFormat(40) }}</h3>
      <p class="price">
        <template v-if="discountRate">
          <strong class="discount">{{ discountRate }}% OFF</strong>
          <span class="real"><i class="uom">￥</i>{{ salePrice }}</span>
          <del class="original">{{ originalPrice }}</del>
        </template>
        <template v-else>
          <span class="real"><i class="uom">￥</i>{{ originalPrice }}</span>
        </template>
      </p>
      <p class="ohter">
        <span v-if="item.couponTag" class="badge badge_blue">クーポン</span>
        <span v-if="isPreOrderPeriod" class="badge badge_reserved">予約商品</span>
        <span v-if="isSoldOut" class="badge badge_out_stock">品切れ</span>
      </p>
    </div>
    <div class="wishlist-item-checkbox" v-if="isAddCheckbox">
      <span class="bx_input size_l">
        <input :id="'personal-' + item.productNo" type="checkbox" :value="item.productNo" :checked="isChecked">
        <label :for="'personal-' + item.productNo" @click.prevent="checkboxClick(item.productNo)"></label>
      </span>
    </div>
  </router-link>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { Alert } from '@/components/common/modal'
export default {
  name: 'ProductItem',
  props: {
    item: {
      type: Object,
      required: false
    },
    isAddCheckbox: {
      type: Boolean,
      default: false
    },
    selectedNos: {
      type: Array,
      default: () => {
        return []
      }
    },
    area: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('product', ['options']),
    discountRate () {
      return Math.ceil(this.discountAmt / this.item.salePrice * 100)
    },
    discountAmt () {
      return this.item.immediateDiscountAmt + this.item.additionDiscountAmt
    },
    salePrice () {
      return (this.item.salePrice - this.discountAmt).toLocaleString()
    },
    originalPrice () {
      return this.item.salePrice.toLocaleString()
    },
    isSoldOut () {
      return this.isPreOrderPeriod ? this.item.reservationData.reservationStockCnt === 0 : this.item.stockCnt === 0
    },
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.item && this.item.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.item.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.item.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    // 품절임박  여부
    isLittle () {
      if (this.isPreOrderPeriod && this.item.reservationData) {
        if (this.item.reservationData.reservationStockCnt < 5 && this.item.reservationData.reservationStockCnt > 0) {
          return true
        }
        return false
      } else {
        if (this.item.stockCnt < 5 && this.item.stockCnt > 0) {
          return true
        }
        return false
      }
    },
    isChecked () {
      return this.selectedNos.find(no => no === this.item.productNo)
    },
    isShowCart () {
      return this.area !== 'event'
    }
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    ...mapActions('product', ['fetchProductOptions']),
    isNew (itemRegisterYmdt) {
      let currentDate = new Date()
      return currentDate.getTime() < this.fun_date2(itemRegisterYmdt).getTime()
    },
    fun_date2 (data) {
      let date1 = new Date(data.replace(/-/g, '/'))
      date1.setDate(date1.getDate() + 7)
      return date1
    },
    async pushToCart (item) {
      await this.fetchProductOptions(item.productNo)
      if (this.options.flatOptions.length > 1) {
        Alert({ message: 'オプションを選択してください。', title: 'カート' }).then(() => {
          this.$router.push({
            path: `/m/product/detail/${item.productNo}`
          })
        })
      } else {
        let ret = await this.addToCart({
          carts: [
            {
              productNo: item.productNo,
              optionNo: this.options.flatOptions[0].optionNo,
              additionalProductNo: 0,
              orderCnt: 1
            }
          ]
        })
        if (ret) {
          Alert({ message: '商品をカートに入れました。', title: 'カート' })
        }
      }
    },
    checkboxClick (productNo) {
      this.$emit('checkboxSwitch', productNo)
    }
  }
}
</script>
