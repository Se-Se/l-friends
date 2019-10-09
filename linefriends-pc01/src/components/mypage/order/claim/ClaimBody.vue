<template>
  <div class="main">
    <div class="order_detail_hint top" v-if="type === 'cancel'">
      <span class="order-new_fc">
        商品出荷前の場合、キャンセルリクエストが可能です。ただし、キャンセルについてご連絡いただいた時点で、すでにご注文商品の出荷手配・発送が完了している場合、キャンセルをお受けできない場合がございます。予めご了承ください。
      </span>
      <span class="order-new_fc">
        クーポンを利用した場合、キャンセル金額によってはクーポンの利用も取り消されることがございます。その場合、クーポンの有効期限内であれば、再びご利用いただくことができます。
      </span>
      <span class="order-new_fc">
        決済完了状態でキャンセルリクエストをした場合は即返金されますが、商品準備中又は出荷準備中の段階でキャンセルリクエストをした場合、セラーの承認後にご返金いたします。ただし、カード会社の事情により、ご返金までお時間をいただくことがございます。予めご了承ください。
      </span>
    </div>
    <div class="order_detail_hint top" v-else>
      <span class="order-new_fc">
        返品する理由の分類に応じて返送料のご負担先が決まります。理由が不明確な場合は必ずカスタマーセンター(+82-1544-5921)又は1：1お問い合わせを通じてご相談のうえ、返品リクエストをお願いいたします。正しくない理由を選択した場合、セラーが返品をお断りする場合がございます。
      </span>
      <span class="order-new_fc">
        クーポンを利用した場合、返金額によってはクーポンの利用も取り消されることがございます。その場合、クーポンの有効期限内であれば、再びご利用いただくことができます。
      </span>
      <span class="order-new_fc">
        返金リクエストをした場合、セラーの承認後にご返金いたします。ただし、カード会社の事情により、ご返金までお時間をいただくことがございます。予めご了承ください。
      </span>
    </div>
    <option-list :options="claimOptions" :type="type" @estimate="estimate" v-if="claimOptions && claimOptions.length" />
    <div class="order-content">
      <div class="order_detail_table_area">
        <reason-card ref="reasonInfo" :claimOrderOption="claimOrderOption" :options="claimOptions" :type="type" @estimate="estimate" />
        <price-info :price="price" :type="type" />
      </div>

      <div class="cancel_btn_area">
        <button class="btn" @click.prevent="goBack">前へ</button>
        <button class="btn btn_green" @click.prevent="orderClaim" v-if="type === 'cancel'">キャンセルする</button>
        <button class="btn btn_green" @click.prevent="orderClaim" v-else>返品申請</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Confirm, Alert } from '@/components/common/modal'
import OptionList from '@/components/mypage/order/claim/OptionList'
import ReasonCard from '@/components/mypage/order/claim/ReasonCard'
import PriceInfo from '@/components/mypage/order/claim/PriceInfo'
export default {
  props: ['type', 'claimOrderOption', 'claimOptions', 'price'],
  computed: {
    claimedProductOptions () {
      let tempOptions = []
      this.claimOptions.forEach(option => {
        if (option.checked) {
          tempOptions.push({
            orderProductOptionNo: option.orderOptionNo,
            productCnt: option.showCnt
          })
        }
      })
      return tempOptions
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    estimate () {
      let reasonInfo = this.$refs.reasonInfo.reasonInfo
      let claimRequest = {
        claimType: this.type === 'cancel' ? 'CANCEL' : 'RETURN',
        productCnt: 0,
        claimReasonType: reasonInfo.claimReasonType,
        claimedProductOptions: this.claimedProductOptions,
        returnWayType: 'SELLER_COLLECT'
      }
      this.$store.dispatch('myorder/claimEstimate', claimRequest)
    },
    orderClaim () {
      let msg = this.$refs.reasonInfo.checkReason()
      if (this.claimedProductOptions.length === 0) {
        Alert('返品する商品を選択してください。')
      } else if (msg) {
        Alert(msg)
      } else {
        Confirm('注文をキャンセルしますか？').then(result => {
          if (result) {
            let reasonInfo = this.$refs.reasonInfo.reasonInfo
            let claimRequest = {
              claimType: this.type === 'cancel' ? 'CANCEL' : 'RETURN',
              claimReasonType: reasonInfo.claimReasonType,
              claimReasonDetail: reasonInfo.claimReasonDetail,
              saveBankAccountInfo: 'false',
              claimedProductOptions: this.claimedProductOptions,
              returnWayType: 'SELLER_COLLECT'
            }
            if (this.type === 'cancel') {
              this.$store.dispatch('myorder/claimCancel', claimRequest).then(() => {
                this.$store.commit('orderList/GET_NEW')
                Alert('キャンセル申請されました。返金状況は「マイページ＞キャンセル/返品」より確認できます。').then(() => {
                  this.$router.push('/mypage/cancellist')
                })
              })
            } else {
              claimRequest.returnAddress = this.claimOrderOption.returnAddress
              this.$store.dispatch('myorder/claimReturn', claimRequest).then(() => {
                this.$store.commit('orderList/GET_NEW')
                Alert('返品申請されました。 返金状況は「マイページ＞キャンセル/返品」より確認できます。').then(() => {
                  this.$router.push('/mypage/cancellist')
                })
              })
            }
          }
        })
      }
    }
  },
  components: {
    OptionList,
    ReasonCard,
    PriceInfo
  }
}
</script>
