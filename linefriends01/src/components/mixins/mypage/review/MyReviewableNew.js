import { mapState, mapGetters } from 'vuex'
import { optionFormat, formatCurrency } from '@/utils/StringUtils'
import Pagination from '@/components/pc/assets/Pagination'
export default {
  data () {
    return {
    }
  },
  methods: {
    optionFormat (optionUsed, optionType, name, value, inputs, addprice, orderCnt) {
      return optionFormat(optionUsed, optionType, name, value, inputs, addprice, orderCnt)
    },
    pageDownReviews () {
      this.$store.dispatch('profilereview/fetchReviewsMore')
    },
    pageDownReviewable () {
      this.$store.dispatch('profilereview/fetchReviewableMore')
    },
    MyMiliFormat (num) {
      return formatCurrency(num)
    },
    pageChange (page) {
      this.$store.dispatch('profilereview/fetchProductReviewable', { pageNumber: page })
    }
  },
  computed: {
    ...mapState('profilereview', ['productReviewable', 'totalCount']),
    ...mapGetters('common', ['orderStatusTypes'])
  },
  components: {
    Pagination
  },
  updated () {
    if (this.resetPaging) {
      this.$refs.pagination && this.$refs.pagination.reset()
      this.resetPaging = false
    }
  }
}
