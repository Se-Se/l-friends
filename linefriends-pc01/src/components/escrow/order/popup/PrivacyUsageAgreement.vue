<template>
  <modal-layer-popup :visible.sync="active" :popup_size_class="'popup_size_11'">
  <div class="popup-layer" style="display: block;">
      <div class="popup_common popup_size_4">
        <div class="roller_area">
          <h1>個人情報の第三者提供に同意する</h1>
          <div class="text-area">
            <dl>
              <dt>01.プライバシーポリシー</dt>
              <dd></dd>
            </dl>
          </div>
        </div>
        <button class="btn_close" @click.prevent="active=!active">close</button>
      </div>
    </div>
  </modal-layer-popup>
</template>
<script>
// import { mapState } from 'vuex'
import ModalLayerPopup from '@/components/popup/ModalLayerPopup'

export default {
  data () {
    return {
      active: false,
      type: '',
      foreignPartners: [],
      partners: []
    }
  },
  methods: {
    show (type, order) {
      if (order && order.foreignPartners && order.foreignPartners.length > 0) {
        this.foreignPartners = order.foreignPartners
      }
      if (order && order.sellerPrivacyUsagePartners && order.sellerPrivacyUsagePartners.length > 0) {
        this.partners = order.sellerPrivacyUsagePartners
      }
      this.type = type
      this.active = true
    }
  },
  computed: {
    // ...mapState('ordersheet', ['ordersheet']),
    // partner () {
    //   let partnerMap = this.ordersheet.deliveryGroups.reduce((partnerMap, data) => {
    //     partnerMap[data.partnerNo] = data.partnerName
    //     return partnerMap
    //   }, {})
    //   return Object.values(partnerMap).join(',')
    // }
  },
  components: {
    ModalLayerPopup
  }
}
</script>
