import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('productinquiry', ['productInquiries', 'totalCount'])
  },
  data () {
    return {
      currentIndex: '-1',
      pageNo: 1,
      pageSize: 20
    }
  },
  methods: {
    ...mapActions('productinquiry', ['fetchMore']),
    pageChange (page) {
      this.currentIndex = '-1'
      this.pageNo = page
      this.$store.dispatch('productinquiry/fetchProductInquiries', { pageNumber: page })
    },
    openIndex (index) {
      this.currentIndex = index
    }
  }
}
