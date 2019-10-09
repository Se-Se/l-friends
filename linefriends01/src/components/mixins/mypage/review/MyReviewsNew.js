import { mapState, mapActions } from 'vuex'
import { optionFormat, formatCurrency } from '@/utils/StringUtils'
import ImageGallery from '@/components/common/ImageGalleryNew'
import MoreView from '@/components/common/MoreView'
import Pagination from '@/components/pc/assets/Pagination'
import { Confirm } from '@/utils/event-bus'

export default {
  data () {
    return {
      mode: 'WRITE', // VIEW
      page: 1
    }
  },
  components: {
    ImageGallery,
    MoreView,
    Pagination
  },
  computed: {
    ...mapState('review', ['profileProductReviews', 'totalCount']),
    ...mapState('profile', ['profile'])
  },
  methods: {
    ...mapActions('review', ['fetchMoreMyReviews']),
    optionFormat (optionUsed, optionType, name, value, inputs, addprice, orderCnt) {
      return optionFormat(optionUsed, optionType, name, value, inputs, addprice, orderCnt)
    },
    deleteReview (productNo, reviewNo) {
      Confirm({
        message: '상품평을 삭제하시면 복구하거나 다시 작성할 수 없습니다. 삭제하시겠습니까?',
        callback: () => {
          const paramsReview = {
            productNo: productNo,
            reviewNo: reviewNo
          }
          this.$store.dispatch('review/deleteProductReviews', paramsReview)
        }
      })
      // if (confirm('상품평을 삭제하시면 복구하거나 다시 작성할 수 없습니다. 삭제하시겠습니까?')) {
      //   const paramsReview = {
      //     productNo: productNo,
      //     reviewNo: reviewNo
      //   }
      //   this.$store.dispatch('review/deleteProductReviews', paramsReview)
      // }
    },
    MyMiliFormat (num) {
      return formatCurrency(num)
    },
    pageChange (page) {
      this.$store.dispatch('review/fetchProfileProductReviews', { pageNumber: page })
    }
  },
  created () {
    this.$store.dispatch('profile/memberFetch')
  }
}
