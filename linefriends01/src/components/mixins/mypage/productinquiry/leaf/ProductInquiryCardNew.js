import { mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  computed: {
    ...mapState('common', ['malls']),
    ...mapState('productinquiry', ['productInquiries'])
  },
  data () {
    return {
      mode: 'VIEW', // 'MODIFY',
      savedInquiry: {},
      form: {
        update: {
          action: 'button',
          to: '',
          title: this.$t('mypage.productinquiry.update'),
          type: 'short'
        },
        delete: {
          action: 'button',
          to: '',
          title: this.$t('mypage.productinquiry.delete'),
          type: 'short'
        },
        cancel: {
          action: 'button',
          to: '',
          title: this.$t('mypage.productinquiry.cancel'),
          type: 'short'
        },
        add: {
          productNo: 0,
          type: null,
          secreted: false,
          title: '',
          content: '',
          parentInquiryNo: 0,
          email: ''
        }
      },
      secret: {
        idx: 0,
        title: this.$t('mypage.productinquiry.secret'),
        name: 'secret',
        value: 'secret',
        chk: false
      }
    }
  },
  props: {
    inquiry: {},
    index: '',
    currentIndex: ''
  },
  methods: {
    product (productNo) {
      this.$router.push({
        'path': `/goods/detail/${productNo}`
      })
    },
    inquiryType (type) {
      return this.$t('mypage.productinquiry.types.' + type)
    },
    putInquiry () {
      if (this.savedInquiry.content.trim() === '') {
        // alert(this.$t('mypage.productinquiry.validation.emptyContent'))
        Alert({
          message: this.$t('mypage.productinquiry.validation.emptyContent')
        })
        return
      }
      Confirm({
        message: this.$t('mypage.productinquiry.confirm.update'),
        callback: () => {
          const putParams = {
            type: this.savedInquiry.type,
            secreted: this.savedInquiry.secreted,
            content: this.savedInquiry.content,
            title: '',
            inquiryNo: this.savedInquiry.inquiryNo,
            productNo: this.savedInquiry.productNo,
            pageNo: 1 // 페이지네이션이 없기 때문에 무조건 1
          }
          this.$emit('openIndex', '-1')
          this.$store.dispatch('productinquiry/putMyProductInquiry', putParams).catch((e) => {
            if (e.data.code === 'I0007') {
              // alert(e.data.message)
              Alert({
                message: e.data.message
              })
            } else {
              // alert('수정되었습니다.')
              Alert({
                message: '수정되었습니다.'
              })
            }
          }).then(() => {
            this.$store.dispatch('productinquiry/fetchProductInquiries')
          })
        },
        onCancel: () => {
          return false
        }
      })
      // if (confirm(this.$t('mypage.productinquiry.confirm.update'))) {
      //   const putParams = {
      //     type: this.savedInquiry.type,
      //     secreted: this.savedInquiry.secreted,
      //     content: this.savedInquiry.content,
      //     title: '',
      //     inquiryNo: this.savedInquiry.inquiryNo,
      //     productNo: this.savedInquiry.productNo,
      //     pageNo: 1 // 페이지네이션이 없기 때문에 무조건 1
      //   }
      //   this.$emit('openIndex', '-1')
      //   this.$store.dispatch('productinquiry/putMyProductInquiry', putParams).catch((e) => {
      //     if (e.data.code === 'I0007') {
      //       // alert(e.data.message)
      //       Alert({
      //         message: e.data.message
      //       })
      //     } else {
      //       // alert('수정되었습니다.')
      //       Alert({
      //         message: '수정되었습니다.'
      //       })
      //     }
      //   }).then(() => {
      //     this.$store.dispatch('productinquiry/fetchProductInquiries')
      //   })
      // } else {
      //   return false
      // }
    },
    deleteInquiry (inquiryNo) {
      Confirm({
        message: this.$t('mypage.productinquiry.confirm.delete'),
        callback: () => {
          const deleteParams = {
            inquiryNo: inquiryNo,
            productNo: this.savedInquiry.productNo,
            pageNo: this.pageNo
          }
          this.$emit('openIndex', '-1')
          this.$store.dispatch('productinquiry/deleteMyProductInquiry', deleteParams).catch((e) => {
            if (e.data.code === 'I0008') {
              // alert(e.data.message)
              Alert({
                message: e.data.message
              })
            } else {
              // alert('삭제되었습니다.')
              Alert({
                message: '삭제되었습니다.'
              })
            }
          }).then(() => {
            this.$store.dispatch('productinquiry/fetchProductInquiries')
          })
        }
      })
      // if (confirm(this.$t('mypage.productinquiry.confirm.delete'))) {
      //   const deleteParams = {
      //     inquiryNo: inquiryNo,
      //     productNo: this.savedInquiry.productNo,
      //     pageNo: this.pageNo
      //   }
      //   this.$emit('openIndex', '-1')
      //   this.$store.dispatch('productinquiry/deleteMyProductInquiry', deleteParams).catch((e) => {
      //     if (e.data.code === 'I0008') {
      //       // alert(e.data.message)
      //       Alert({
      //         message: e.data.message
      //       })
      //     } else {
      //       // alert('삭제되었습니다.')
      //       Alert({
      //         message: '삭제되었습니다.'
      //       })
      //     }
      //   }).then(() => {
      //     this.$store.dispatch('productinquiry/fetchProductInquiries')
      //   })
      // }
    },
    resetInquiry () {
      this.savedInquiry = { ...this.inquiry }
    },
    priceFormat (price) {
      return formatCurrency(price)
    },
    goViewMode () {
      // if (confirm('취소하시겠습니까?')) {
      //   this.mode = 'VIEW'
      //   this.savedInquiry = { ...this.inquiry }
      // }
      Confirm({
        message: '취소하시겠습니까?',
        callback: () => {
          this.mode = 'VIEW'
          this.savedInquiry = { ...this.inquiry }
        }
      })
    },
    onClick () {
      this.$emit('openIndex', this.currentIndex === this.index ? '-1' : this.index)
    }
  },
  mounted () {
    this.savedInquiry = { ...this.inquiry }
  }
}
