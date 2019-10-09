import { formatCurrency } from '@/utils/StringUtils'
import { mapState, mapGetters } from 'vuex'
import { Alert } from '@/utils/event-bus'

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
      isShowReview: false,
      promotionCode: ''
    }
  },
  computed: {
    ...mapState('validCoupon', ['getNoValidCoupons', 'noLoading', 'loading']),
    ...mapGetters('common', ['productInquiryTypes']),
    totalCount () {
      return this.getNoValidCoupons && this.getNoValidCoupons.totalCount
    }
  },
  methods: {
    noDone () { },
    MyMiliFormat (val) {
      return formatCurrency(val)
    },
    manageDate (date) {
      if (date) {
        let splitedDate = date.split(' ')
        splitedDate[1] = splitedDate[1].substr(0, 5)
        return splitedDate
      }
    },
    pageChange (page) {
      this.$store.dispatch('validCoupon/getNoValidCoupons', { pageNumber: page })
    },
    registerCoupon () {
      if (this.promotionCode === '.' || this.promotionCode === '..') {
        Alert({
          message: '쿠폰 코드를 다시 확인해 주세요.'
        })
        return
      }
      if (this.promotionCode === '') {
        Alert({
          message: '할인쿠폰코드를 입력하세요.'
        })
        return
      }
      this.$store.dispatch('validCoupon/registerCoupon', this.promotionCode).then(() => {
        this.resetPaging = true
        this.$store.dispatch('validCoupon/getNoValidCoupons')
        Alert({
          message: '쿠폰발급이 완료되었습니다.'
        })
      })
    }
  }
}
