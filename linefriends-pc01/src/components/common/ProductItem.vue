<template>
  <a href="javascript:void(0);">
    <div class="photo_wrap" :class="isSoldOut ? 'shortage' : ''">
      <span v-if="item.mainBestProductYn" class="icon best">BEST</span>
      <span v-if="isNew(item.registerYmdt) && !item.mainBestProductYn" class="icon new">NEW</span>
      <span v-if="item.stickerInfos && item.stickerInfos[0].label==='MD推薦'" class="icon recommend">おすすめ</span>
      <span v-if="isLittle" class="icon red">あとわずか</span>
      <div class="thumbnail" @click.prevent="makeUrlLink(item.productNo)">
        <img class="item_img" :src="item.imageUrls[0]" :alt="item.productName" :title="item.productName">
        <img class="item_img_hover" :src="item.imageUrls[item.imageUrls.length >= 2 ? 1 : 0]" :alt="item.productName" :title="item.productName">
      </div>
      <span v-if="isShowCart" class="cart" @click.prevent="addCart(item)">cart</span>
      <template v-if="isAddCheckbox">
        <span class="bx_input">
          <input :id="'personal-' + item.productNo" :ref="'personal-' + item.productNo" type="checkbox" :value="item.productNo" :checked="isChecked">
          <label :for="'personal-' + item.productNo" @click.prevent="checkboxClick(item.productNo)"></label>
        </span>
      </template>
    </div>
    <div class="good_info" @click.prevent="makeUrlLink(item.productNo)">
      <span v-if="item.promotionText" class="describe">{{ item.promotionText }}</span>
      <h3 class="name">{{ item.productName | bytesFormat(44) }}</h3>
      <p class="price">
        <template v-if="discountRate">
          <strong class="discount">{{ discountRate }}%</strong>
          <span class="real"><i class="uom">￥</i>{{ (item.salePrice - discountAmt) | formatCurrency }}</span>
          <del class="original">{{ item.salePrice | formatCurrency }}</del>
        </template>
        <template v-else>
          <span class="real"><i class="uom">￥</i>{{ item.salePrice | formatCurrency }}</span>
        </template>
      </p>
      <p class="ohter">
        <span v-if="item.couponTag" class="badge badge_blue">クーポン</span>
        <span v-if="isPreOrderPeriod" class="badge badge_reserved">予約商品</span>
        <span v-if="isSoldOut" class="badge badge_gray2">品切れ</span>
      </p>
    </div>
  </a>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { includeNow } from '@/utils/dateUtils'
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
    isSoldOut () {
      return this.isPreOrderPeriod ? this.item.reservationData.reservationStockCnt === 0 : this.item.stockCnt === 0
    },
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.item && this.item.reservationData) {
        return includeNow(this.item.reservationData.reservationStartYmdt, this.item.reservationData.reservationEndYmdt)
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
    isRealNum (val) {
      if (typeof val !== 'number') {
        return false
      }
      if (!isNaN(val)) {
        return true
      } else {
        return false
      }
    },
    fun_date2 (data) {
      let date1 = new Date(data.replace(/-/g, '/'))
      date1.setDate(date1.getDate() + 7)
      return date1
    },
    async addCart (item) {
      await this.fetchProductOptions(item.productNo)
      if (this.options.flatOptions.length > 1) {
        Alert({ message: 'オプションを選択してください。', title: 'カート' }).then(() => {
          this.$router.push({
            path: `/product/detail/${item.productNo}`
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
    },
    makeUrlLink (productNo) {
      // console.log(this.$route)
      if (this.$router.app._route.name === 'EventDetail') {
        this.$router.push({
          path: `/product/detail/${productNo}`,
          query: {
            active: this.$route.fullPath
          }
        })
      } else if (this.$router.app._route.name === 'KeywordSearch') {
        this.$router.push({
          path: `/product/detail/${productNo}`,
          query: {
            active: `${this.$route.path}?keyword=${this.$route.query.keyword}`
          }
        })
      } else {
        this.$router.push({
          path: `/product/detail/${productNo}`,
          query: {
            prevActive: this.$route.params.subCategoryNo ? `/goods/${this.$route.params.categoryNo}?depth1Desc=${this.$route.query.depth1Desc}` : null,
            active: !this.$route.params.categoryNo ? this.$route.fullPath : (this.$route.path + (this.$route.params.categoryNo ? '?depth1Desc=' + this.$route.query.depth1Desc : '') + (this.$route.params.subCategoryNo ? '&depth2Desc=' + this.$route.query.depth2Desc : ''))
          }
        })
      }
    }
  }
}
</script>
