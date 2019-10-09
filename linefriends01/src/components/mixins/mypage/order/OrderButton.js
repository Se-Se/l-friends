import { mapActions } from 'vuex'
import { Alert } from '@/utils/event-bus'
import $ from 'jquery'

export default {
  props: ['option', 'nonMember'],
  computed: {
    reviewState () {
      return (this.option.orderStatusType === 'BUY_CONFIRM') || (this.option.orderStatusType === 'DELIVERY_DONE' && !this.option.deliverable)
    }
  },
  methods: {
    ...mapActions('myorder', ['putClaimsWithdraw', 'getClaimResult', 'getMutiReturnClaimResult', 'postOrderClaimCancel', 'putOrderOptionConfirm']),
    ...mapActions('guestorder', ['getGuestMutiReturnClaimResult', 'putGuestClaimsWithdraw', 'postGuestOrderClaimCancel', 'putGuestOrderOptionConfirm']),
    cancelOrder () {
      const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
      if (this.nonMember) {
        this.$router.push({
          path: '/nonmember/cancel/' + this.option.orderOptionNo,
          query: {
            fromUrl: thisUrl
          }
        })
      } else {
        this.$router.push({
          path: '/mypage/cancel/' + this.option.orderOptionNo,
          query: {
            fromUrl: thisUrl
          }
        })
      }
    },
    cancelAllOrder () {
      if (this.nonMember) {
        this.postGuestOrderClaimCancel(this.option.orderNo).then(() => {
          // 922 issue
          Alert({
            message: '주문취소가 정상적으로 되었습니다.',
            callback: () => {
              this.$router.go(0)
            }
          })
          // alert('주문취소가 정상적으로 되었습니다.')
        })
      } else {
        this.postOrderClaimCancel(this.option.orderNo).then(() => {
          // 922 issue
          Alert({
            message: '주문취소가 정상적으로 되었습니다.',
            callback: () => {
              this.$router.go(0)
            }
          })
          // alert('주문취소가 정상적으로 되었습니다.')
        })
      }
    },
    deliveryTracking () {
      if (this.option.deliverable && !this.option.delivery.retrieveInvoiceUrl) {
        return Alert({
          message: '직접배송의 경우 배송조회를 지원하지 않습니다. 판매자에게 문의해주세요. '
        })
        // alert('직접배송의 경우 배송조회를 지원하지 않습니다. 판매자에게 문의해주세요. ')
      } else {
        window.open(this.option.delivery.retrieveInvoiceUrl)
      }
    },
    reviewOption () {
      this.$emit('showAddReviewPopup', this.option)
    },
    requestReturn () {
      if (this.nonMember) {
        const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
        this.$router.push({
          path: '/nonmember/return/' + this.option.orderOptionNo,
          query: {
            fromUrl: thisUrl
          }
        })
      } else {
        const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
        this.$router.push({
          path: '/mypage/return/' + this.option.orderOptionNo,
          query: {
            fromUrl: thisUrl
          }
        })
      }
    },
    withdrawClaim () {
      const withdrawparam = {
        claimNo: this.option.claimNo
      }
      if (this.nonMember) {
        this.$store.dispatch('guestorder/putMultiClaimWithdraw', withdrawparam).then(() => {
          // 922 issue
          Alert({
            message: '철회되었습니다.',
            callback: () => {
              window.location.href = `/nonmember/orderdetail/${this.option.orderOptionNo}`
            }
          })
          // alert('철회되었습니다.')
        })
      } else {
        this.$store.dispatch('myorder/getClaimResult', {
          claimParams: {
            orderOptionNo: this.option.orderOptionNo
          }
        }).then(ret => {
          if ((ret && ret.data.claimedOption.claimStatusType !== 'RETURN_PROC_BEFORE_RECEIVE') && (ret && ret.data.claimedOption.claimStatusType !== 'RETURN_REQUEST') && (ret && ret.data.claimedOption.claimStatusType !== 'CANCEL_REQUEST')) {
            // 922 issue
            Alert({
              message: '주문상품의 상태가 변경되었습니다. 확인 후 다시 시도해 주세요.',
              callback: () => {
                window.location.href = '/mypage/cancellist'
              }
            })
            // alert('주문상품의 상태가 변경되었습니다. 확인 후 다시 시도해 주세요.')
          } else {
            // 922 issue
            this.$store.dispatch('myorder/putMultiClaimWithdraw', withdrawparam).then(() => {
              // 922 issue
              Alert({
                message: '철회되었습니다.',
                callback: () => {
                  window.location.href = '/mypage/orderlist'
                }
              })
              // alert('철회되었습니다.')
            })
          }
        })
      }
    },
    showInquiryPopup () {
      // $('html').css('overflow', 'hidden')
      this.$emit('showInquiryPopup', this.option.productNo)
    },
    showCancelDetailPopup () {
      this.$emit('showCancelDetailPopup', this.option.orderOptionNo)
    },
    showReturnDetailPopup () {
      this.$emit('showReturnDetailPopup', this.option.claimNo)
    }
  }
}
