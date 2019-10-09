import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      showPopFlg: false,
      inquiryProductNo: 0,
      cancelDetailOrderOptionNo: 0,
      returnDetailClaimNo: 0,
      orderOption: {},
      isShowContact: false,
      isShowReview: false
    }
  },
  methods: {
    showInquiryPopup (productNo) {
      this.inquiryProductNo = productNo
      this.isShowContact = true
      this.$refs.productInquiryPopup.openProductInquiryPopup()
    },
    showAddReviewPopup (orderOption) {
      this.orderOption = orderOption
      this.isShowReview = true
      this.$refs.orderAddreviewPopup.openOrderAddreviewPopup()
    },
    enterBeforePage () {
      let theType = this.$route.query.type
      switch (theType) {
        case 'ORDER':
          this.$router.push('/mypage/orderlist')
          break
        case 'CANCEL':
          this.$router.push('/mypage/cancellist')
          break
        default:
          this.$router.push('/mypage/orderlist')
          break
      }
      // this.$router.back()
    },
    showCancelDetailPopup (orderOptionNo) {
      this.cancelDetailOrderOptionNo = orderOptionNo
      this.$refs.orderClaimCancelDetailPopup.openOrderClaimDetailPopup(this.cancelDetailOrderOptionNo, false)
    },
    showReturnDetailPopup (claimNo) {
      this.returnDetailClaimNo = claimNo
      this.$refs.orderClaimReturnDetailPopup.openOrderReturnDetailPopup(this.returnDetailClaimNo, false)
    }
  },
  computed: {
    ...mapState('myorder', ['order']),
    ...mapGetters('common', ['productInquiryTypes'])
  }
}
