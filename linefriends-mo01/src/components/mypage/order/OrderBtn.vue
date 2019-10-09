<template>
  <ul class="btn_list">
    <li v-if="option.orderStatusType === 'DEPOSIT_WAIT'">
      <button class="btn btn_primary size_xs" @click.prevent="orderCancel">キャンセル</button>
    </li>
    <li v-if="canCancelAll">
      <button class="btn btn_primary size_xs no_padding_btn" @click.prevent="goCancel">キャンセル申請</button>
    </li>
    <li v-if="canViewDelivery">
      <button class="btn btn_primary size_xs" @click.prevent="goDelivery">配送照会</button>
    </li>
    <li v-if="canOrderWriteReview">
      <button class="btn btn_primary size_xs no_padding_btn" @click.prevent="goReview">レビューの作成</button>
    </li>
    <!-- <li v-if="canOrderReturn">
      <button class="btn btn_primary size_xs" @click.prevent="goReturn">返品申請</button>
    </li> -->
    <!-- <li v-if="canOrderDeliveryDone">
      <button class="btn btn_primary size_xs" @click.prevent="confirmDelievry">受取確認</button>
    </li>
    <li v-if="canConfirmBuy">
      <button class="btn btn_primary size_xs" @click.prevent="confirmBuy">購入確定</button>
    </li> -->
    <li v-if="canCancelView">
      <button class="btn btn_primary size_xs no_padding_btn" @click.prevent="showCancelStatusPopup">キャンセル現状</button>
    </li>
    <li v-if="canCancelResult">
      <button class="btn btn_primary size_xs no_padding_btn" @click.prevent="showCancelStatusPopup">キャンセル結果</button>
    </li>
    <!-- <li v-if="canCancelWithdraw">
      <button class="btn btn_primary size_xs" @click.prevent="withdrawCancel">キャンセル撤回</button>
    </li> -->
    <li v-if="canReturnView">
      <button class="btn btn_primary size_xs" @click.prevent="showReturnStatusPopup">返品現状</button>
    </li>
    <li v-if="canReturnResult">
      <button class="btn btn_primary size_xs" @click.prevent="showReturnStatusPopup">返品結果</button>
    </li>
    <!-- <li v-if="canReturnWithdraw">
      <button class="btn btn_primary size_xs" @click.prevent="withdrawReturn">返品撤回</button>
    </li> -->
    <li v-if="option.orderStatusType !== 'DEPOSIT_WAIT'">
      <button class="btn btn_primary size_xs no_padding_btn" @click.prevent="goQuestion">お問い合わせ</button>
    </li>
  </ul>
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
        path: '/m/mypage/cancel/' + this.option.orderOptionNo,
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
    goReview () {
      let review = {
        productNo: this.option.productNo,
        optionNo: this.option.optionNo,
        orderOptionNo: this.option.orderOptionNo
      }
      this.$store.commit('review/SET_CURRENTREVIEW', review)
      this.$router.push('/m/mypage/myreview/addreview')
    },
    goReturn () {
      this.$router.push({
        path: '/m/mypage/return/' + this.option.orderOptionNo,
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
      this.$router.push(`/m/mypage/canceldetail/${this.option.orderOptionNo}`)
    },
    showReturnStatusPopup () {
      // alert('TODO:ReturnStatusPopup')
      this.$router.push(`/m/mypage/returndetail/${this.option.claimNo}`)
    },
    goQuestion () {
      this.$router.push(`/m/product/detail/${this.option.productNo}/inquiry?from=Order`)
    }
  }
}
</script>
