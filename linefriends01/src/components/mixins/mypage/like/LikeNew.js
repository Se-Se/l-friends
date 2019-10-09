import { mapState } from 'vuex'
import { productPrice, formatCurrency } from '@/utils/StringUtils'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  data () {
    return {
      selectedNos: [],
      allSelector: false,
      currentPage: 1,
      page: this.$router.currentRoute.params.page || 1
    }
  },
  computed: {
    ...mapState('likeProducts', ['likeProducts']),
    totalCount () {
      return this.likeProducts && this.likeProducts.totalCount
    },
    isAllSelected () {
      return this.selectedNos.length === this.likeProducts.length
    },
    isSoldOut () {
      return this.likeProducts.stockCnt === 0
    }
  },
  methods: {
    async pageChange (page) {
      this.currentPage = '-1'
      await this.$store.dispatch('likeProducts/fetchLikeProducts', { pageNumber: page })

      this.selectedNos = []
      this.changeAllSelector()
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
        // alert('상품을 선택해주세요.')
        Alert({
          message: this.$t('layout.cart.selectGoods')
        })
      } else {
        // if (confirm('선택한 상품을 삭제하시겠습니까?')) {
        //   this.$store.dispatch('likeProducts/pageLikeProducts', this.selectedNos).then(() => {
        //     this.selectedNos = []
        //     this.changeAllSelector()
        //     this.currentPage = 1
        //     this.$store.dispatch('member/mySummary')
        //   })
        // }
        Confirm({
          message: '선택한 상품을 삭제하시겠습니까?',
          callback: () => {
            this.$store.dispatch('likeProducts/pageLikeProducts', this.selectedNos).then(() => {
              this.selectedNos = []
              this.changeAllSelector()
              this.currentPage = 1
              this.$store.dispatch('member/mySummary')
            })
          }
        })
      }
    },
    allSelect () {
      if (this.likeProducts && this.allSelector) {
        this.selectedNos = []
        this.likeProducts.forEach(p => {
          this.selectedNos.push(p.productNo)
        })
      } else {
        // 전체선택 해제
        this.selectedNos = []
      }
    },
    changeAllSelector () {
      this.allSelector = this.selectedNos.length === this.likeProducts.length ? 1 : false
    },
    getIconSticker (product) {
      const tempSticker = []
      if (product.stickerLabels) {
        if (product.stickerLabels.some(sticker => sticker === '기부천사')) {
          tempSticker.push('기부천사')
        }
        if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
          tempSticker.push('쿠폰')
        }
        if (product.deliveryConditionType === 'FREE') {
          tempSticker.push('무료배송')
        }
      } else {
        if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
          tempSticker.push('쿠폰')
        }
        if (product.deliveryConditionType === 'FREE') {
          tempSticker.push('무료배송')
        }
      }
      if (tempSticker.length === 4) {
        tempSticker.pop()
        tempSticker.pop()
      }
      if (tempSticker.length === 3) {
        tempSticker.pop()
      }
      return tempSticker
    }
  }
}
