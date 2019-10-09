<template>
  <div id="container" class="mypage">
    <div class="wrap">
      <sub-menu title="キャンセル申請" />
      <div class="mypage-content">
        <h1>キャンセル申請</h1>
        <claim-body type="cancel" :claimOrderOption="claimOrderOption" :claimOptions="claimOptions" :price="claimPrice" v-if="claimOrderOption" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SubMenu from '@/components/mypage/SubMenu'
import ClaimBody from '@/components/mypage/order/claim/ClaimBody'

export default {
  name: 'OrderClaimCancel',
  computed: {
    ...mapState('myorder', ['claimOrderOption', 'claimEstimate', 'claimOptions']),
    ...mapGetters('myorder', ['claimPrice'])
  },
  components: {
    SubMenu,
    ClaimBody
  }
}
</script>
