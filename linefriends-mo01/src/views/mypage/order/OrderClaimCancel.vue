<template>
  <div id="container" class="cart-order">
    <breadcrumb title="キャンセル申請" />

    <div class="cart_wrapper">
      <div class="cart_header">
        <div :class="['bx_list_checkbox notice_padding cf', {'cancel_notice_close' : showFlg}]">
          <p class="cancel_notice" @click.prevent="showFlg = !showFlg">キャンセル申請時の注意事項</p>
          <p class="cancel_notice_txt">
            商品出荷前の場合、キャンセルリクエストが可能です。ただし、キャンセルについてご連絡いただいた時点で、すでにご注文商品の出荷手配・発送が完了している場合、キャンセルをお受けできない場合がございます。予めご了承ください。
            <br><br>

            クーポンを利用した場合、キャンセル金額によってはクーポンの利用も取り消されることがございます。その場合、クーポンの有効期限内であれば、再びご利用いただくことができます。<br><br>

            決済完了状態でキャンセルリクエストをした場合は即返金されますが、商品準備中又は出荷準備中の段階でキャンセルリクエストをした場合、セラーの承認後にご返金いたします。ただし、カード会社の事情により、ご返金までお時間をいただくことがございます。予めご了承ください。
          </p>
        </div>
      </div>
      <claim-body type="cancel" :claimOrderOption="claimOrderOption" :claimOptions="claimOptions" :price="claimPrice" v-if="claimOrderOption" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Breadcrumb from '@/components/common/Breadcrumb'
import ClaimBody from '@/components/mypage/order/claim/ClaimBody'

export default {
  name: 'OrderClaimCancel',
  data: function () {
    return {
      showFlg: false
    }
  },
  computed: {
    ...mapState('myorder', ['claimOrderOption', 'claimEstimate', 'claimOptions']),
    ...mapGetters('myorder', ['claimPrice'])
  },
  components: {
    Breadcrumb,
    ClaimBody
  }
}
</script>
