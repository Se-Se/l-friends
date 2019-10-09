import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      showMonth: false,
      showPopFlg: false,
      inquiryProductNo: 0,
      orderOption: {},
      pageNo: 1,
      pageSize: 20,
      isShowContact: false,
      isShowReview: false
    }
  },
  computed: {
    ...mapState('myorder', ['loading', 'totalCount', 'orders', 'selectTypeFlg']),
    ...mapGetters('common', ['productInquiryTypes'])
  },
  methods: {
    noDone () { },
    pageChange (index) {
      this.pageNo = index
      this.$store.dispatch('myorder/fetchMoreNew', this.pageNo)
    },
    getOrders (period) {
      this.showMonth = false
      this.pageNo = 1
      this.$router.push({
        path: '/mypage/orderlist',
        query: {
          type: 'ORDER',
          period
        }
      })
    },
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
    clickMonth () {
      this.showMonth = !this.showMonth
    }
  }
}
