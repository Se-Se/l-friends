import { mapGetters, mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { addClass, removeClass } from '@/utils/utils'

export default {
  data () {
    return {
      active: false,
      showClaimResult: {
        claimNo: 0,
        claimPriceInfo: {},
        claimReasonDetail: '',
        claimReasonType: '',
        claimType: '',
        claimedOption: {},
        orderProductOptionNo: 0,
        refundType: '',
        returnAddress: {}
      },
      txt: {
        title: '',
        titleInfo: '',
        titleReason: '',
        reasonType: '',
        reasonDetail: ''
      },
      bodyScrollTop: 0
    }
  },
  props: {
    showClaimType: {
      type: String,
      required: false
    }
  },
  mounted () {
    if (this.showClaimType === 'CANCEL') {
      this.txt.title = '취소 상세정보'
      this.txt.titleInfo = '취소 상세정보'
      this.txt.titleReason = '취소사유'
      this.txt.reasonType = '취소사유구분'
      this.txt.reasonDetail = '취소상세사유'
    } else if (this.showClaimType === 'RETURN') {
      this.txt.title = '반품 상세정보'
      this.txt.titleInfo = '반품 상세정보'
      this.txt.titleReason = '반품사유'
      this.txt.reasonType = '반품사유구분'
      this.txt.reasonDetail = '반품상세사유'
    }
  },
  computed: {
    ...mapState('myorder', ['claimResult']),
    ...mapState('guestorder', ['claimResult']),
    ...mapGetters('common', ['claimReasonTypes']),
    showPayType () {
      let showPayType = ''

      switch (this.showClaimResult.refundType) {
        case 'PAYCO':
          showPayType = 'PAYCO'
          break
        case 'CREDIT_CARD':
          showPayType = '신용카드'
          break
      }
      return showPayType
    },
    refundAmt () {
      const producrAmt = this.showClaimResult.claimPriceInfo.productAmtInfo ? this.showClaimResult.claimPriceInfo.productAmtInfo.standardPrice : 0
      const deliveryAmt = this.showClaimResult.claimPriceInfo.deliveryAmtInfo ? this.showClaimResult.claimPriceInfo.deliveryAmtInfo.totalAmt : 0
      return producrAmt + deliveryAmt
    },
    deductionAmt () {
      const tempClaimInfo = this.showClaimResult.claimPriceInfo
      if (tempClaimInfo && tempClaimInfo.subtractionAmtInfo && tempClaimInfo.productAmtInfo) {
        let deductionAmt = 0
        deductionAmt += tempClaimInfo.subtractionAmtInfo.cartCouponAmt
        deductionAmt += tempClaimInfo.subtractionAmtInfo.deliveryCouponAmt
        deductionAmt += tempClaimInfo.productAmtInfo.immediateDiscountAmt
        deductionAmt += tempClaimInfo.productAmtInfo.additionalDiscountAmt
        deductionAmt += tempClaimInfo.productAmtInfo.productCouponDiscountAmt
        deductionAmt += tempClaimInfo.subtractionAmtInfo.refundAdjustAmt
        return deductionAmt * -1
      }
    },
    showRefundSubtractionAmt () {
      return this.showClaimResult.claimPriceInfo.subtractionAmtInfo ? formatCurrency(this.showClaimResult.claimPriceInfo.subtractionAmtInfo.totalAmt) : 0
    },
    showRefundPayAmt () {
      return this.showClaimResult.claimPriceInfo ? formatCurrency(this.showClaimResult.claimPriceInfo.refundPayAmt) : 0
    }
  },
  methods: {
    openOrderReturnDetailPopup (claimNo, nonMember) {
      this.getOrderReturnResult(claimNo, nonMember)
      this.active = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
    },
    openOrderClaimDetailPopup (orderOptionNo, nonMember) {
      this.getOrderClaimResult(orderOptionNo, nonMember)
      this.active = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
    },
    closeOrderClaimDetailPopup () {
      this.active = false
      removeClass(document.body, 'no_scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
    },
    getOrderClaimResult (orderOptionNo, nonMember) {
      if (nonMember) {
        this.$store.dispatch('guestorder/getGuestClaimResult', {
          claimParams: {
            orderOptionNo: orderOptionNo
          }
        }).then(() => {
          this.showClaimResult = this.$store.state.guestorder.claimResult
        })
      } else {
        this.$store.dispatch('myorder/getClaimResult', {
          claimParams: {
            orderOptionNo: orderOptionNo
          }
        }).then(() => {
          this.showClaimResult = this.$store.state.myorder.claimResult
          this.formatOption()
        })
      }
    },
    getOrderReturnResult (claimNo, nonMember) {
      if (nonMember) {
        this.$store.dispatch('guestorder/getMultiClaimResult', {
          claimParams: {
            claimNo: claimNo
          }
        }).then(() => {
          this.showClaimResult = this.$store.state.guestorder.multiClaimResult
        })
      } else {
        this.$store.dispatch('myorder/getMultiClaimResult', {
          claimParams: {
            claimNo: claimNo
          }
        }).then(() => {
          this.showClaimResult = this.$store.state.myorder.multiClaimResult
        })
      }
    },
    formatOption () {
      this.showClaimResult.claimedOptions.forEach(item => {
        item.showOptions = []
        if (item.optionUsed) {
          if (item.optionName && item.optionValue) {
            const optionNames = item.optionName.split('|')
            const optionValues = item.optionValue.split('|')

            optionNames.forEach((tempName, index) => {
              item.showOptions.push(tempName + ':' + optionValues[index])
            })
          }
          if (item.inputs && item.inputs.length > 0) {
            item.inputs.forEach(optionInput => {
              item.showOptions.push(optionInput.inputLabel + ':' + optionInput.inputValue)
            })
          }
          if (item.price.addPrice > 0) {
            let last = item.showOptions.pop()
            let lastoption = last + ' (+' + formatCurrency(item.price.addPrice) + '원)'
            item.showOptions.push(lastoption)
          }
        } else {
          item.showOptions.push('본품')
        }
        item.showOptions.push(item.orderCnt + '개')
      })
    },
    showBrandName (brandName) {
      if (brandName !== '') {
        brandName = '[' + brandName + ']'
      }
      return brandName
    }
  }
}
