<template>
  <div>
    <div class="address_info">
      <h2>반품 수거 정보</h2>
      <div class="edit">
        <a href="#" v-if="!claimOrderOption.claimType" @click.prevent="openOrderClaimReturnAddressPopup">수거지 정보 변경</a>
      </div>
      <div class="info">
        <table class="table_info">
          <tbody>
            <tr>
              <th>받는 사람</th>
              <td :colspan="showReturnAddress.customsIdNumber ? 1 : 3">{{showReturnAddress.receiverName}}</td>
              <th v-if="showReturnAddress.customsIdNumber">개인통관고유부호</th>
              <td v-if="showReturnAddress.customsIdNumber"><span class="num">{{showReturnAddress.customsIdNumber}}</span></td>
            </tr>
            <tr>
              <th>주소</th>
              <td colspan="3"><span class="num">{{showReturnAddress.receiverZipCd}}</span>-{{showReturnAddress.receiverAddress}} {{showReturnAddress.receiverDetailAddress}}</td>
            </tr>
            <tr>
              <th>휴대전화</th>
              <td colspan="3"><span class="num">{{showReturnAddress.receiverContact1}}</span></td>
            </tr>
            <!-- <tr>
              <th>배송메모</th>
              <td colspan="3">{{showReturnAddress.deliveryMemo}}</td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>
    <address-pop ref="addressPop" :returnAddress="claimOrderOption.returnAddress" :requireCustomsIdNumber="!!claimOrderOption.returnAddress.customsIdNumber"  @setReturnAddress="setReturnAddress" :isShowAddress.sync="isShowAddress" />
  </div>
</template>

<script>
import AddressPop from '@/components/pc/pages/mypage/order/claim/OrderClaimReturnAddressNew'
import AddressInfoNew from '@/components/mixins/mypage/order/claim/AddressInfoNew'

export default {
  mixins: [AddressInfoNew],
  components: {
    AddressPop
  }
}
</script>

