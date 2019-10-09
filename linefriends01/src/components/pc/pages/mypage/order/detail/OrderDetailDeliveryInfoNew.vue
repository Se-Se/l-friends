<template>
  <div class="horizontal">
    <div class="horizontal__header">
      <h2 class="horizontal__header--title">배송지정보</h2>
    </div>
    <div class="edit">
      <a href="#"
        class="btn_link"
        @click.prevent="openOrderDetailAddressPopup"
        v-if="shippingAddress.showButtonFlg">배송지 정보 변경</a>
    </div>
    <div class="info">
      <table class="horizontal__tbl">
        <colgroup>
          <col span="1" style="width:20%;">
          <col span="1" style="width:80%;">
        </colgroup>
        <tbody>
          <tr>
            <td>받는 사람</td>
            <td v-if="showCustomsID">{{shippingAddress.receiverName}}</td>
            <td v-else colspan="3">{{shippingAddress.receiverName}}</td>
            <th v-if="showCustomsID">개인통관고유부호</th>
            <td v-if="showCustomsID"><span class="num">{{shippingAddress.customsIdNumber}}</span></td>
          </tr>
          <tr>
            <td>주소</td>
            <td colspan="3"><span class="num">{{shippingAddress.receiverZipCd}}</span>{{shippingAddress.receiverAddress}} {{shippingAddress.receiverDetailAddress}}</td>
          </tr>
          <tr>
            <td>휴대전화</td>
            <td colspan="3"><span class="num">{{shippingAddress.receiverContact1}}</span></td>
          </tr>
          <tr>
            <td>배송메모</td>
            <td colspan="3">{{shippingAddress.deliveryMemo}}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="shippingAddress.showLabelFlg">
        <div class="txt-interval">
          <p class="order-delivery">상품/배송준비중 상태인 경우 배송지 직접 변경이 불가하오니 변경을 원하실 경우 <router-link class="link-blue" to="/mypage/inquiry">1:1 문의</router-link>를 이용해 주세요.</p>
        </div>
      </div>
    </div>
    <order-detail-address ref="orderDetailAddress" :orderNo="orderNo" :shippingAddress="shippingAddress" :requireCustomsIdNumber="!!shippingAddress.customsIdNumber" :nonMember="nonMember" :isShowAddress.sync="isShowAddress" @closePop="closePop" />
  </div>
</template>
<script>
import OrderDetailAddress from '@/components/pc/pages/mypage/order/detail/OrderDetailAddressNew'
import OrderDetailDeliveryInfoNew from '@/components/mixins/mypage/order/detail/OrderDetailDeliveryInfoNew'

export default {
  mixins: [OrderDetailDeliveryInfoNew],
  components: {
    OrderDetailAddress
  }
}
</script>
