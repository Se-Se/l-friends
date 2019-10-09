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
          if (item.orderOptions) {
            let claimNos = []
            item.orderOptions.forEach(option => {
              claimNos.push(option.claimNo)
            })
            item.viewOptions = []
            let claimArr = Array.from(new Set(claimNos))
            claimArr.forEach(no => {
              var temp = []
              item.orderOptions.forEach((option, index) => {
                if (no === option.claimNo) {
                  temp.push(option)
                }
              })
              temp.forEach((obj, index) => {
                if (obj.claimNo === 0 || obj.claimNo === null) {
                  obj.claimButton = true
                  obj.btnRowspan = 1
                } else {
                  if (index === 0) {
                    obj.claimButton = true
                  } else {
                    obj.claimButton = false
                  }
                  obj.btnRowspan = claimNos.filter(claimNo => claimNo === no).length
                }
                obj.orderYmdt = item.orderYmdt
                item.viewOptions.push(obj)
              })
            })
          }
        })
      }
    }
  }
}
