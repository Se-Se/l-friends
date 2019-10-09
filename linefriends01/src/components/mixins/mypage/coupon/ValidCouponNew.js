import { formatCurrency } from '@/utils/StringUtils'
import { mapState, mapGetters, mapActions } from 'vuex'
import { Alert } from '@/utils/event-bus'

export default {
  data () {
    return {
      showMonth: false,
      showPopFlg: false,
      inquiryProductNo: 0,
      orderOption: {},
      pageNo: 1,
      pageSize: 10,
      isShowContact: false,
      isShowReview: false,
      promotionCode: ''
    }
  },
  computed: {
    ...mapState('validCoupon', ['getValidCoupons', 'noLoading', 'loading']),
    ...mapGetters('common', ['productInquiryTypes']),
    totalCount () {
      return this.getValidCoupons && this.getValidCoupons.totalCount
    }
  },
  methods: {
    ...mapActions('validCoupon', { _registerCoupon: 'registerCoupon' }),
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
    validationCheck () {
      if (this.promotionCode === '.' || this.promotionCode === '..') {
        return '쿠폰 코드를 다시 확인해 주세요.'
      }
      if (this.promotionCode === '') {
        return '할인쿠폰코드를 입력하세요.'
      }

      return false
    },
    pageChange (page) {
      this.$store.dispatch('validCoupon/getValidCoupons', { pageNumber: page })
    },
    async registerCoupon () {
      const error = this.validationCheck()
      if (error) {
        return Alert({
          message: error
        })
      }

      await this._registerCoupon(this.promotionCode)

      this.resetPaging = true
      this.$store.dispatch('validCoupon/getValidCoupons')
      Alert({
        message: '쿠폰발급이 완료되었습니다.'
      })
    }
  }
}
