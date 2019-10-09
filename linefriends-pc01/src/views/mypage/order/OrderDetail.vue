<template>
  <div id="container" class="mypage" v-if="order">
    <div class="wrap">
      <sub-menu title="注文の詳細" />
      <div class="mypage-content">
        <h1>注文の詳細</h1>
        <detail-body :order="order" :productInfo="productInfo" @openPop="openPop" @writeReview="writeReview" @showInquiryPop="showInquiryPop" v-if="order" />
      </div>
    </div>
    <address-pop :address="order.shippingAddress" :deliveryMemo="order.deliveryMemo" :deliveryWishYmdt="order.deliveryWishYmdt" :deliveryTimeText="order.deliveryTimeText" @closePop="closePop" v-if="popFlg" />
    <review-pop :isShow="showReview" :review="currentReview" @closePop="closeReviewPop" />
    <qa-layer-popup ref="inquiryPopup" :visible="layerPopupStatus" :theInquiryNo="0" :data="productInquiryTypes" @close="closeInquiryPop" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SubMenu from '@/components/mypage/SubMenu'
import DetailBody from '@/components/mypage/order/detail/DetailBody'
import AddressPop from '@/components/mypage/order/detail/AddressPop'
import ReviewPop from '@/components/common/ReviewPop'
import QaLayerPopup from '@/components/common/QaLayerPopup'

export default {
  name: 'OrderDetail',
  data () {
    return {
      popFlg: false,
      showReview: false,
      currentReview: null,
      layerPopupStatus: null
    }
  },
  computed: {
    ...mapState('myorder', ['order']),
    ...mapGetters('myorder', ['productInfo']),
    ...mapGetters('common', ['productInquiryTypes'])
  },
  methods: {
    openPop () {
      this.$store.commit('SHOW_POP')
      this.popFlg = true
    },
    closePop () {
      this.$store.commit('CLOSE_POP')
      this.popFlg = false
    },
    writeReview (review) {
      this.$store.commit('SHOW_POP')
      this.showReview = true
      this.currentReview = review
    },
    closeReviewPop (okFLg) {
      if (okFLg === true) {
        this.$store.dispatch('myorder/getOrder', { orderNo: this.$route.params.orderNo })
      }
      this.$store.commit('CLOSE_POP')
      this.showReview = false
      this.currentReview = null
    },
    showInquiryPop (productNo) {
      this.$store.commit('SHOW_POP')
      this.$refs.inquiryPopup.setProductNo(productNo)
      this.layerPopupStatus = 'contactAdd'
    },
    closeInquiryPop () {
      this.$store.commit('CLOSE_POP')
      this.layerPopupStatus = null
    }
  },
  components: {
    SubMenu,
    DetailBody,
    AddressPop,
    ReviewPop,
    QaLayerPopup
  }
}
</script>
