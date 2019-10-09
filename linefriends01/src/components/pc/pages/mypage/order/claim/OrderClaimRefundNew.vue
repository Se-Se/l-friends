<template>
  <div
    class="old-css"
    v-if="claimOrderOption">
    <div class="mypage">
      <top-txt :isReturn="claimTypeReturn" />
      <refund-list :isReturn="claimTypeReturn" :firstOption="claimOrderOption.originalOption" :addOptions="viewableClaimOptions" :claimInfo="returnInfo" @claimEstimate="returnEstimate" />
      <div class="address_info">
        <h2>{{claimTypeReturn ? '반품 사유' : '취소 사유'}}</h2>
        <div class="info">
          <table class="table_info reason">
            <tbody>
              <tr>
                <th>사유 구분</th>
                <td>
                  <div class="sel_wrap sp2 size_2">
                    <div class="bx_select">
                      <a href="javascript:" class="txt_select" v-click-outside="hideReason" :class="{ on: active }" v-toggle="active" ref="claimType">
                        {{txt.claimReasonType}}
                        <span class="ico_arrow">목록 열기</span>
                      </a>
                      <ul class="lst_select_content">
                        <li v-for="(selectType, index) in claimOrderOption.claimReasonTypes" :key="index" @click.prevent="updateClaimType(selectType)">
                          <a href="javascript:">{{selectType.label}}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="tip_1 txtsp" v-if="txt.responsibleObjectType && claimTypeReturn"><span class="txt_color_blue">{{txt.responsibleObjectType}}</span></div>
                </td>
              </tr>
              <tr>
                <th>상세 사유</th>
                <td>
                  <div class="text_wrap_1">
                    <textarea placeholder="상세사유를 입력해 주세요." v-model="claimReasonDetail" maxlength="160"></textarea>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <refund-info :refundInfos="refundInfos">
        <h2 slot="title">환불 예정 정보</h2>
      </refund-info>
      <address-info ref="addInfo" :claimOrderOption="claimOrderOption" v-if="claimTypeReturn" />
      <ul class="btn_style_3">
        <li>
          <button class="btn_white" @click.prevent="enterBeforePage">이전</button>
        </li>
        <li>
          <button class="btn_gray" @click.prevent="returnOrderOption">{{claimTypeReturn ? '반품 신청' : '취소 신청'}}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TopTxt from '@/components/pc/pages/mypage/order/claim/TopTxtNew'
import RefundList from '@/components/pc/pages/mypage/order/claim/RefundListNew'
import RefundInfo from '@/components/pc/pages/mypage/order/common/RefundInfoNew'
import AddressInfo from '@/components/pc/pages/mypage/order/claim/AddressInfoNew'
import OrderClaimRefundNew from '@/components/mixins/mypage/order/claim/OrderClaimRefundNew'

export default {
  mixins: [OrderClaimRefundNew],
  components: {
    TopTxt,
    RefundList,
    RefundInfo,
    AddressInfo
  }
}
</script>
