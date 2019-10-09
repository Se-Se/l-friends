import { mapState } from 'vuex'
import $ from 'jquery'

export default {
  computed: {
    ...mapState('profileinquiry', ['inquiries', 'totalCount'])
  },
  data () {
    return {
      currentIndex: '-1',
      page: this.$router.currentRoute.params.page || 1
    }
  },
  methods: {
    showInquiryPopup () {
      this.$refs.signInInquiry.showInquiryPopup()
      // $('html').css('overflow', 'hidden')
    },
    pageChange (page) {
      this.currentIndex = '-1'
      this.$store.dispatch('profileinquiry/fetchInquiries', { pageNumber: page })
    },
    openIndex (index) {
      this.currentIndex = index
    }
  },
  updated () {
    if (this.resetPaging) {
      this.$refs.pagination && this.$refs.pagination.reset()
      this.resetPaging = false
    }
  }
}
