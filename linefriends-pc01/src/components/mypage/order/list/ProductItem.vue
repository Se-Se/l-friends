<template>
  <tr>
    <td v-if="index === 0" :rowspan="order.orderOptions.length">
      <p class="order_date">{{order.orderYmdt | dateFormatStr('yyyy-MM-dd')}}</p>
      <p class="ser_no">{{option.orderNo}}</p>
      <p class="detail_link">
        <router-link :to="type ? `/mypage/orderdetail/${option.orderNo}?type=${type}` : `/mypage/orderdetail/${option.orderNo}`">詳細</router-link>
      </p>
    </td>
    <td>
      <router-link class="product_info" :to="`/product/detail/${option.productNo}`">
        <div class="product_img"><img :src="option.imageUrl"></div>
        <div class="detail_txt">
          <dl class="badge_area" v-if="option.reservation">
            <dt><span class="badge badge_reserved">予約商品</span></dt>
            <dd>{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}日から順次発送</dd>
          </dl>
          <p style="word-break: break-all;">{{option.productName | bytesFormat(47)}}</p>
          <p class="sub_info" v-if="optionTitle">
            {{ optionTitle }}
          </p>
          <p class="sub_info">
            購入数 : {{option.orderCnt}}個
          </p>
        </div>
      </router-link>
    </td>
    <td>
      <p class="mix_box"><span class="num">{{ option.orderCnt }}</span> 件</p>
    </td>
    <td>
      <p class="mix_box">￥<span class="num">{{option.price.buyAmt | formatCurrency}}</span></p>
    </td>
    <td>
      <p class="state">{{{orderType : option.orderStatusType, claimType : option.claimStatusType} | showStatus}}</p>
    </td>
    <td>
      <order-btn :option="option" :options="order.orderOptions" @writeReview="writeReview" @showInquiryPop="showInquiryPop" @showReturnDetailPopup="showReturnDetailPopup" @showCancelDetailPopup="showCancelDetailPopup" />
      <qa-layer-popup ref="inquiryPopup" :visible="layerPopupStatus" :theInquiryNo="theInquiry" :data="productInquiryTypes" :productNo="option.productNo" @close="closeInquiryPoup" />
      <order-claim-detail-popup :showClaimType="'CANCEL'" ref="orderClaimCancelDetailPopup"></order-claim-detail-popup>
      <order-claim-detail-popup :showClaimType="'RETURN'" ref="orderClaimReturnDetailPopup"></order-claim-detail-popup>
    </td>
  </tr>
</template>
<script>
import OrderBtn from '@/components/mypage/order/OrderBtn'
import QaLayerPopup from '@/components/common/QaLayerPopup'
import OrderClaimDetailPopup from '@/components/mypage/order/OrderClaimDetailPopup'
import { formatOptionTitle } from '@/utils/utils'
import { mapGetters } from 'vuex'
export default {
  props: ['order', 'option', 'index', 'type'],
  components: {
    QaLayerPopup,
    OrderBtn,
    OrderClaimDetailPopup
  },
  computed: {
    ...mapGetters('common', ['productInquiryTypes']),
    optionTitle () {
      let label = ''
      label = formatOptionTitle(this.option.optionUsed, this.option.optionType, this.option.optionName, this.option.optionValue, this.option.price.addPrice)
      return label
    }
  },
  data () {
    return {
      reviewShow: false,
      layerPopupStatus: null,
      theInquiry: 0,
      cancelDetailOrderOptionNo: 0,
      returnDetailClaimNo: 0
    }
  },
  methods: {
    showInquiryPop (productNo) {
      this.$store.commit('SHOW_POP')
      this.$refs.inquiryPopup.setProductNo(productNo)
      this.layerPopupStatus = 'contactAdd'
    },
    writeReview (review) {
      this.$emit('writeReview', review)
    },
    closeInquiryPoup () {
      this.$store.commit('CLOSE_POP')
      this.layerPopupStatus = null
    },
    showCancelDetailPopup (orderOptionNo) {
      this.cancelDetailOrderOptionNo = orderOptionNo
      this.$refs.orderClaimCancelDetailPopup.openOrderClaimDetailPopup(this.cancelDetailOrderOptionNo, false)
    },
    showReturnDetailPopup (orderOptionNo) {
      this.returnDetailClaimNo = orderOptionNo
      this.$refs.orderClaimReturnDetailPopup.openOrderReturnDetailPopup(this.returnDetailClaimNo, false)
    }
  }
}
</script>
