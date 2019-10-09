<template>
  <div class="cart_main">
    <div v-if="claimOptions && claimOptions.length">
      <claim-item v-for="(option, idx) in claimOptions" :key="`option_${idx}`" :option="option" :type="type" @estimate="estimate" />
    </div>
    <div>
      <reason-card ref="reasonInfo" :claimOrderOption="claimOrderOption" :options="claimOptions" :type="type" @estimate="estimate" />

      <div class="settlement_information">
        <div class="settlement_information_ttl">
          <p class="ttl">返金予定の詳細</p>
        </div>
        <price-info :price="price" :type="type" />
        <div class="button_area">
          <button class="btn" @click.prevent="goBack">前へ</button>
          <button class="btn btn_green" @click.prevent="orderClaim">キャンセルする</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Confirm, Alert } from '@/components/common/modal'
import ClaimItem from '@/components/mypage/order/claim/ClaimItem'
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
                  this.$router.push('/m/mypage/cancellist')
                })
              })
            } else {
              claimRequest.returnAddress = this.claimOrderOption.returnAddress
              this.$store.dispatch('myorder/claimReturn', claimRequest).then(() => {
                this.$store.commit('orderList/GET_NEW')
                Alert('返品申請されました。 返金状況は「マイページ＞キャンセル/返品」より確認できます。').then(() => {
                  this.$router.push('/m/mypage/cancellist')
                })
              })
            }
          }
        })
      }
    }
  },
  components: {
    ClaimItem,
    ReasonCard,
    PriceInfo
  }
}
</script>
