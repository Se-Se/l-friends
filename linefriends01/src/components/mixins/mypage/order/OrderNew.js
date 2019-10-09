export default {
  props: {
    order: {
      type: Array,
      required: true
    },
    showOrderType: {
      type: String,
      required: true
    },
    type: {
      type: String
    },
    nonMember: {
      type: Boolean
    }
  },
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
  watch: {
    order () {
      if (this.order) {
        this.order.forEach(item => {
          const claimNos = []
          const claimOption = []
          item.orderOptions.forEach(option => {
            claimNos.push(option.claimNo)
            if (option.claimNo) {
              claimOption.push(option)
            }
          })
          item.viewOptions = []
          const claimArr = Array.from(new Set(claimNos))

          claimOption.forEach((item, index) => {
            item.firstTd = index === 0
            item.rowspan = claimOption.length
          })
          claimArr.forEach(no => {
            const temp = []
            item.orderOptions.forEach((option, index) => {
              if (no === option.claimNo) {
                temp.push(option)
              }
            })
            temp.forEach((obj, index) => {
              obj.claimButton = index === 0
              obj.btnRowspan = claimNos.filter(claimNo => claimNo === no).length
              obj.orderYmdt = item.orderYmdt
              item.viewOptions.push(obj)
            })
          })
        })
      }
    }
  }
}
