<template>
  <div class="btn_area">
    <button class="btn btn_primary size_s" @click.prevent="orderCancel" v-if="option.orderStatusType === 'DEPOSIT_WAIT'">キャンセル</button>
    <button class="btn btn_primary size_s" @click.prevent="goCancel" v-if="canCancelAll">キャンセル申請</button>
    <button class="btn btn_primary size_s" @click.prevent="goDelivery" v-if="canViewDelivery">配送照会</button>
    <button class="btn btn_primary size_s" @click.prevent="showNewReviewPopup" v-if="canOrderWriteReview">レビューの作成</button>
    <!-- <button class="btn btn_primary size_s" @click.prevent="goReturn" v-if="canOrderReturn">返品申請</button> -->
    <!-- <button class="btn btn_primary size_s" @click.prevent="confirmDelievry" v-if="canOrderDeliveryDone">受取確認</button> -->
    <!-- <button class="btn btn_primary size_s" @click.prevent="confirmBuy" v-if="canConfirmBuy">購入確定</button> -->
    <button class="btn btn_primary size_s" @click.prevent="showCancelStatusPopup" v-if="canCancelView">キャンセル現状</button>
    <button class="btn btn_primary size_s" @click.prevent="showCancelStatusPopup" v-if="canCancelResult">キャンセル結果</button>
    <!-- <button class="btn btn_primary size_s" @click.prevent="withdrawCancel" v-if="canCancelWithdraw">キャンセル撤回</button> -->
    <button class="btn btn_primary size_s" @click.prevent="showReturnStatusPopup" v-if="canReturnView">返品現状</button>
    <button class="btn btn_primary size_s" @click.prevent="showReturnStatusPopup" v-if="canReturnResult">返品結果</button>
    <!-- <button class="btn btn_primary size_s" @click.prevent="withdrawReturn" v-if="canReturnWithdraw">返品撤回</button> -->
    <div class="last_btn_area" v-if="option.orderStatusType !== 'DEPOSIT_WAIT'">
      <button class="btn btn_primary size_s" @click.prevent="goQuestion">お問い合わせ</button>
    </div>
  </div>
</template>

<script>
import { Alert } from '@/components/common/modal'
export default {
  props: ['option', 'options'],
  computed: {
    canCancelAll () {
      let showBtn = true
      this.options.forEach(option => {
        if ((option.orderStatusType === 'DEPOSIT_WAIT' || option.orderStatusType === 'PAY_DONE' || option.orderStatusType === 'PRODUCT_PREPARE') && option.nextActions && option.nextActions.length) {
          let tempFlg = false
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'CANCEL') {
              tempFlg = true
            }
          })
          if (!tempFlg) {
            showBtn = false
          }
        } else {
          showBtn = false
        }
      })
      return showBtn
    },
    canViewDelivery () {
      let result = false
      if (this.option.orderStatusType && this.option.nextActions) {
        if (this.option.orderStatusType === 'DELIVERY_ING' || (this.option.deliverable && this.option.orderStatusType === 'DELIVERY_DONE')) {
          this.option.nextActions.forEach(action => {
            if (action.nextActionType === 'VIEW_DELIVERY') {
              result = true
            }
          })
        }
      }
      return result
    },
    canOrderWriteReview () {
      let result = false
      if (this.option.orderStatusType && this.option.nextActions) {
        result = this.option.orderStatusType === 'DELIVERY_DONE' || this.option.orderStatusType === 'BUY_CONFIRM' || this.option.orderStatusType === 'DELIVERY_ING'
        result = result && (this.option.nextActions.some(action => {
          return action.nextActionType === 'WRITE_REVIEW'
        }))
      }
      return result
    },
    canOrderReturn () {
      let result = false
      if (this.option.orderStatusType && this.option.nextActions) {
        if ((this.option.orderStatusType === 'DELIVERY_ING' || this.option.orderStatusType === 'DELIVERY_DONE') && this.option.deliverable) {
          this.option.nextActions.forEach(action => {
            if (action.nextActionType === 'RETURN') {
              result = true
            }
          })
        }
      }
      return result
    },
    canOrderDeliveryDone () {
      let result = false
      if (this.option.orderStatusType && this.option.nextActions) {
        if (this.option.orderStatusType === 'DELIVERY_ING') {
          this.option.nextActions.forEach(action => {
            if (action.nextActionType === 'DELIVERY_DONE') {
              result = true
            }
          })
        }
      }
      return result
    },
    canConfirmBuy () {
      let result = false
      if (this.option.orderStatusType && this.option.nextActions) {
        if (this.option.orderStatusType === 'DELIVERY_DONE' && this.option.deliverable) {
          this.option.nextActions.forEach(action => {
            if (action.nextActionType === 'CONFIRM_ORDER') {
              result = true
            }
          })
        }
      }
      return result
    },
    canCancelView () {
      let result = false
      if (this.option.claimStatusType && this.option.nextActions) {
        let type = this.option.claimStatusType
        if ((type === 'CANCEL_REQUEST') || (type === 'CANCEL_PROC_REQUEST_REFUND') || (type === 'CANCEL_PROC_WAITING_REFUND')) {
          result = true
        }
      }
      return result
    },
    canCancelResult () {
      let result = false
      if (this.option.claimStatusType && this.option.nextActions) {
        if ((this.option.claimStatusType === 'CANCEL_NO_REFUND') || (this.option.claimStatusType === 'CANCEL_DONE')) {
          result = true
        }
      }
      return result
    },
    canReturnView () {
      let result = false
      if (this.option.claimStatusType && this.option.nextActions) {
        let type = this.option.claimStatusType
        if ((type === 'RETURN_REQUEST') || (type === 'RETURN_REJECT_REQUEST') || (type === 'RETURN_PROC_BEFORE_RECEIVE') || (type === 'RETURN_PROC_REQUEST_REFUND') || (type === 'RETURN_PROC_WAITING_REFUND')) {
          result = true
        }
      }
      return result
    },
    canReturnResult () {
      let result = false
      if (this.option.claimStatusType && this.option.nextActions) {
        if (this.option.claimStatusType === 'RETURN_DONE') {
          result = true
        }
      }
      return result
    }
  },
  methods: {
    orderCancel () {
      this.$store.dispatch('myorder/orderClaimCancel', this.option.orderNo).then(() => {
        Alert('注文が正常にキャンセルされました。').then(() => {
          this.$router.go(0)
        })
      })
    },
    goCancel () {
      this.$router.push({
        path: '/mypage/cancel/' + this.option.orderOptionNo,
        query: {
          fromUrl: `${location.protocol}//${location.host}${this.$route.fullPath}`
        }
      })
    },
    goDelivery () {
      if (this.option.deliverable && this.option.delivery && this.option.delivery.retrieveInvoiceUrl) {
        window.open(this.option.delivery.retrieveInvoiceUrl)
      } else {
        Alert('直接配送の場合追跡サービスが利用できません。販売者へ問い合わせてください。')
      }
    },
    showNewReviewPopup () {
      let review = {
        productNo: this.option.productNo,
        optionNo: this.option.optionNo,
        orderOptionNo: this.option.orderOptionNo
      }
      this.$emit('writeReview', review)
    },
    goReturn () {
      this.$router.push({
        path: '/mypage/return/' + this.option.orderOptionNo,
        query: {
          fromUrl: `${location.protocol}//${location.host}${this.$route.fullPath}`
        }
      })
    },
    confirmDelievry () {
      this.$store.dispatch('myorder/deliveryDone', this.option.orderOptionNo).then(() => {
        this.$router.go(0)
      })
    },
    confirmBuy () {
      this.$store.dispatch('myorder/optionConfirm', this.option.orderOptionNo).then(() => {
        Alert('購入確定処理されました。').then(() => {
          this.$router.go(0)
        })
      })
    },
    showCancelStatusPopup () {
      // alert('TODO:CancelStatusPopup')
      this.$emit('showCancelDetailPopup', this.option.orderOptionNo)
    },
    showReturnStatusPopup () {
      // alert('TODO:ReturnStatusPopup')
      this.$emit('showReturnDetailPopup', this.option.claimNo)
    },
    goQuestion () {
      this.$emit('showInquiryPop', this.option.productNo)
    }
  }
}
</script>
