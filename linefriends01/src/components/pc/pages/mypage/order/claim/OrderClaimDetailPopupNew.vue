<template>
  <modal-layer-popup :visible.sync="active" :popup_size_class="'popup_size_3 roller_area'" popup_name="orderClaimDetailPopupName" @closeOrderClaimDetailPopup="closeOrderClaimDetailPopup">
    <h1 slot="title">{{txt.title}}</h1>
    <div class="con layer-popup__overflow">
      <div class="layer-popup__interval">
        <table class="table">
          <colgroup>
            <col class="width-60p" style="width: 50%;">
            <col class="width-10p" style="width: 30%;">
            <col class="width-30p" style="width: 20%;">
          </colgroup>
          <thead>
            <tr>
              <th>상품정보</th>
              <th>수량</th>
              <th>주문상태</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="showClaimResult.claimedOptions" v-for="(claimedOption, item) in showClaimResult.claimedOptions">
              <tr :key="item">
                <td>
                  <div class="info">
                    <strong>{{(showBrandName(claimedOption.brandName) + claimedOption.productName) | wordsFormat(44)}}</strong>
                    <span>
                      <template v-for="showOption, index in claimedOption.showOptions">
                        <template v-if="index === 0">{{showOption}}</template>
                        <template v-else> / {{showOption}}</template>
                      </template>
                      <template v-if="claimedOption.showAddPrice">
                        {{claimedOption.showAddPrice}}
                      </template>
                      <template v-if="claimedOption.showOrderCnt">
                        {{claimedOption.showOrderCnt}}
                      </template>
                    </span>
                  </div>
                </td>
                <td><span class="num">{{claimedOption.orderCnt}}</span></td>
                <td>{{claimedOption.statusLabel ? claimedOption.statusLabel : showClaimResult.claimedOption.statusLabel}}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <h1 class="layer-popup__upper-title">{{txt.titleReason}}</h1>
      <div class="layer-popup__interval">
        <table class="layer-popup__tbl">
          <tr>
            <th scope="row">{{txt.reasonType}}</th>
            <td v-for="claimReasonType in claimReasonTypes" :key="claimReasonType.value" v-if="claimReasonType.value === showClaimResult.claimReasonType">
              {{claimReasonType.label}}
            </td>
          </tr>
          <tr>
            <th scope="row">{{txt.reasonDetail}}</th>
            <td class="layer-popup__cancel">{{showClaimResult.claimReasonDetail | decodeEntities}}</td>
          </tr>
        </table>
      </div>
      <h1 class="layer-popup__upper-title">환불 정보</h1>
      <div class="layer-popup__interval">
        <table class="layer-popup__tbl">
          <tr>
            <th>환불 상품 금액</th>
            <td><span class="data num">{{refundAmt | formatCurrency}} </span>원</td>
          </tr>
          <tr>
            <th>차감 금액</th>
            <td>
              <span class="newline"><span class="data num">{{deductionAmt | formatCurrency}}</span>원</span>
              <div class="tip" v-if="showClaimResult.claimPriceInfo && showClaimResult.claimPriceInfo.subtractionAmtInfo && showClaimResult.claimPriceInfo.subtractionAmtInfo.refundAdjustReason">
                <div class="tip_popup size_3">
                  <dl>
                    <dt>차감 사유</dt>
                    <dd>{{showClaimResult.claimPriceInfo.subtractionAmtInfo.refundAdjustReason}}</dd>
                  </dl>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>환불 금액</th>
            <td><span class="data num">{{showRefundPayAmt}}</span>원</td>
          </tr>
          <tr>
            <th>환불 수단</th>
            <!-- <td>{{showPayType}}</td> -->
            <td>
              <template v-if="showClaimResult.claimPriceInfo.refundPayType === 'ACCUMULATION'">
                임직원 포인트
              </template>
              <template v-else>
                {{showClaimResult.claimPriceInfo.refundTypeLabel}}
              </template>
            </td>
          </tr>
        </table>
      </div>
      <template v-if="showClaimType === 'RETURN' && showClaimResult.returnWayType === 'SELLER_COLLECT' && showClaimResult.returnAddress.name && showClaimResult.returnAddress.contact1">
        <h1 class="layer-popup__upper-title">반품수거정보<small class="subtitle">상품 수거를 위해 아래 주소로 택배기사가 방문합니다.</small></h1>
        <div class="layer-popup__interval">
          <table class="layer-popup__tbl">
            <tr>
              <th>받는사람</th>
              <td><span class="data num">{{showClaimResult.returnAddress.name}}</span></td>
            </tr>
            <tr>
              <th>주소</th>
              <td><span class="data num">{{showClaimResult.returnAddress.addressStr}}</span></td>
            </tr>
            <tr>
              <th>휴대전화</th>
              <td><span class="data num">{{showClaimResult.returnAddress.contact1}}</span></td>
            </tr>
          </table>
        </div>
      </template>
      <div class="default-center">
        <button class="default-button active" @click.prevent="closeOrderClaimDetailPopup">확인</button>
      </div>
    </div>
  </modal-layer-popup>
</template>

<script>
import ModalLayerPopup from '@/components/popup/ModalLayerPopupNew'
import OrderClaimDetailPoupNew from '@/components/mixins/mypage/order/claim/OrderClaimDetailPopupNew'
export default {
  mixins: [OrderClaimDetailPoupNew],
  components: {
    ModalLayerPopup
  },
  name: 'OrderClaimDetailPopup'
}
</script>
<style scoped>
.table_item {
  width: 100%;
}
.popup_common .data {
  padding: 0 !important;
  padding-right: 3px !important;
  border: none !important;
  margin: 0 !important;
  display: inline !important;
}
.popup_common .table_info th {
  box-sizing: border-box;
  width: 201px;
  background: #fafafa;
  padding-left: 40px;
  font-size: 14px;
  color: #5a5a5a;
}
.popup_common .table_info th,
.popup_common .table_info td {
  border-top: 1px solid #f0f0f0;
  box-sizing: border-box;
}
.popup_common .table_info td {
  padding: 16px 20px;
  color: #3c3c3c;
}
.popup_wrap .popup_common .table_item .info {
  border: none;
  height: inherit;
}
.layer-popup__cancel {
  width: 465px;
  max-width: 465px;
  padding: 20px 0 20px 10px;
  font-family: "Noto Sans KR";
  font-size: 14px;
  font-weight: normal;
  color: #333333;
  vertical-align: middle;
  word-wrap: break-word;
}
</style>
