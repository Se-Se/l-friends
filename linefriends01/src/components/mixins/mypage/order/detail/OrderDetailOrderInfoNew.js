export default {
  data () {
    return {
      orderArr: []
    }
  },
  props: ['order', 'nonMember'],
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
  mounted () {
    this.orderArr.push(this.order)
  },
  watch: {
    order () {
      if (this.order) {
        this.orderArr = []
        this.orderArr.push(this.order)
      }
    }
  }
}
