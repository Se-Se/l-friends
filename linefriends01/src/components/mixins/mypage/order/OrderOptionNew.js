export default {
  data () {
    return {
      showPopFlg: false
    }
  },
  props: ['option', 'nonMember', 'showOrderType', 'isDetail'],
  methods: {
    showInquiryPopup (productNo) {
      this.$emit('showInquiryPopup', productNo)
    },
    showAddReviewPopup (orderOption) {
      this.$emit('showAddReviewPopup', orderOption)
    },
    showCancelDetailPopup (orderOptionNo) {
      this.$emit('showCancelDetailPopup', orderOptionNo)
    },
    showReturnDetailPopup (orderOptionNo) {
      this.$emit('showReturnDetailPopup', orderOptionNo)
    }
  },
  computed: {
    showFirstTd () {
      if (this.showOrderType === 'CANCEL') {
        return this.option.firstTd && !this.isDetail
      } else {
        return this.option.claimButton && !this.isDetail
      }
    },
    firstRowspan () {
      if (this.showOrderType === 'CANCEL') {
        return this.option.rowspan
      } else {
        return this.option.btnRowspan
      }
    },
    showDisable () {
      return this.option.buttons && this.option.buttons.indexOf('NOT_REFUNDABLE')
    }
  }
}
