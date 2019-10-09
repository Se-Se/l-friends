<template>
  <div class="popup_wrap">
    <div class="popup_common popup_size_7">
      <h1>
        <font style="vertical-align: inherit;">
          <font style="vertical-align: inherit;">개인정보 제공 판매업체 리스트</font>
        </font>
      </h1>
      <div class="con">
        <div class="name_list">
          <p>
            <font style="vertical-align: inherit;">
              <font style="vertical-align: inherit;">회사는 상품 판매 및 배송, 본인확인 등 거래 이행을 위하여 필요한 최소한의 개인정보에 대해 이용자가 상품구매 시 별도로 동의한 경우에만 아래 개인정보를 제공하고 있습니다. 제공받는업체는서비스 제휴계약에따라 변경될 수 있으니 수시로 확인하시기 바랍니다.</font>
            </font>
          </p>
          <ul>
            <li v-for="partner in partners" :key="partner.partnerNo">
              <font style="vertical-align: inherit;">
                <font style="vertical-align: inherit;">{{ partner.partnerName}}</font>
              </font>
            </li>
            <li v-if="partners && partners.length % 3 >= 1">
              <div class="bx_dummy" />
            </li>
            <li v-if="partners && partners.length % 3 == 1">
              <div class="bx_dummy" />
            </li>
          </ul>
        </div>
      </div>
      <button class="btn_close" @click="close">
        <font style="vertical-align: inherit;">
          <font style="vertical-align: inherit;">close</font>
        </font>
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('common', ['partners'])
  },
  methods: {
    close () {
      this.$emit('closePop')
    }
  }
}
</script>
