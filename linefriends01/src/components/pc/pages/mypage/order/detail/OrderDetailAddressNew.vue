<template>
  <div class="old-css">
    <modal-layer-popup :visible.sync="active.popup" :popup_size_class="'popup_size_1'" popup_name="orderDetailAddressPopupName" @closeOrderDetailAddressPopup="closeOrderDetailAddressPopup">
      <h1 slot="title">배송지 정보 변경</h1>
      <div class="con mypage-layerpopup">
        <table class="table_info">
          <tbody>
            <tr>
              <th><span class="must">받는 사람</span></th>
              <td>
                <div class="width-200">
                  <input type="text" placeholder="받는사람 입력" title="수취인 입력" v-model="myInput.receiverName" ref="receiverName">
                </div>
              </td>
            </tr>
            <tr>
              <th><span class="must">주소</span></th>
              <td>
                <div class="table-grid">
                  <div class="table-grid__left input_con width-200 zipcode">
                    <input type="text" disabled="disabled" title="우편번호 검색란" v-model="myInput.receiverZipCd" ref="receiverZipCd">
                  </div>
                  <div class="able-grid__left btn_con width-100">
                    <button class="btn btn_gray2" @click.prevent="openAddressesPopup">변경</button>
                  </div>
                </div>
                <div class="table-grid pad_top_6">
                  <div class="table-grid__left input_con">
                    <input type="text" disabled="disabled" title="기본주소 입력란" v-model="myInput.receiverAddress" ref="receiverAddress">
                  </div>
                </div>
                <div class="table-grid pad_top_6">
                  <div class="table-grid__left input_con">
                    <input type="text" title="상세주소 입력란" v-model="myInput.receiverDetailAddress" ref="receiverDetailAddress">
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th><span class="must">휴대전화</span></th>
              <td>
                <div class="phone_num">
                  <div class="table-grid__left width-94 input_con">
                    <div class="bx_select">
                      <a href="#" class="txt_select" :class="{ on: active.receiverContact1 }" v-toggle="active.receiverContact1">
                        {{this.txt.prefixReceiverContact1}}
                        <span class="ico_arrow">목록 열기</span>
                      </a>
                      <ul class="lst_select_content">
                        <li><a href="#" @click.prevent="setPrefixReceiverContact1('010')">010</a></li>
                        <li><a href="#" @click.prevent="setPrefixReceiverContact1('011')">011</a></li>
                        <li><a href="#" @click.prevent="setPrefixReceiverContact1('016')">016</a></li>
                        <li><a href="#" @click.prevent="setPrefixReceiverContact1('017')">017</a></li>
                        <li><a href="#" @click.prevent="setPrefixReceiverContact1('018')">018</a></li>
                        <li><a href="#" @click.prevent="setPrefixReceiverContact1('019')">019</a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="table-grid__left width-94 input_con" style="width:150px;">
                    <input type="text" maxlength="4" title="휴대폰 두번째 자리 입력" required="" v-model="showReceiverContact1Two" ref="receiverContact1Two" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                  </div>
                  <div class="table-grid__left width-94 input_con">
                    <input type="text" maxlength="4" title="휴대폰 마지막자리 입력" required="" v-model="showReceiverContact1Three" ref="receiverContact1Three" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="shippingAddress.customsIdNumber">
              <th>
                <span class="must">개인통관고유부호
                  <div class="tip">
                    <div class="tip_popup">해외직배송 상품 구매 시 국내 통관 절차를 위해
                      ‘개인통관고유부호’를 제출해야 합니다.</div>
                  </div>
                </span>
              </th>
              <td>
                <div class="table-grid">
                  <div class="table-grid__left width-240 input_con">
                    <input type="text" v-model="myInput.customsIdNumber">
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>배송메모</th>
              <td>
                <div class="input_con">
                  <div class="bx_select" v-click-outside="closeMemo">
                    <a :class="inputMemoShow">
                      <input type="text" id='inputMemo' @blur="inputMemoBlur()" maxlength=50 v-model='myInput.deliveryMemo'>
                      <span class="input_num">{{myInput.deliveryMemo.length}}/50</span>
                      <span class="ico_arrow" v-toggle="active.memo">목록 열기</span>
                    </a>
                    <a v-toggle="active.memo" :class="txtSelectShow">
                      {{myInput.deliveryMemo}}
                      <span class="ico_arrow">목록 열기</span>
                    </a>
                    <ul class="lst_select_content">
                      <li><a href="#" @click.prevent="inputMemo()">선택해주세요.</a></li>
                      <li><a href="#" @click.prevent="setDeliveryMemo('부재중 시 경비실에 맡겨주세요')">부재중 시 경비실에 맡겨주세요</a></li>
                      <li><a href="#" @click.prevent="setDeliveryMemo('깨짐 위험이 있으니 조심해 주세요')">깨짐 위험이 있으니 조심해 주세요</a></li>
                      <li><a href="#" @click.prevent="setDeliveryMemo('현관문 앞에 놔주세요')">현관문 앞에 놔주세요</a></li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <ul class="btn_list">
          <li>
            <button class="btn btn_white" @click.prevent="closeOrderDetailAddressPopup">취소</button>
          </li>
          <li>
            <button class="btn btn_gray" @click.prevent="modifyShippingAddress">변경</button>
          </li>
        </ul>
      </div>
    </modal-layer-popup>
    <addresses @setPopupAddress="setPopupAddress" ref="addresses" :isShowAddresses.sync="isShowAddresses" @openFather="openOrderDetailAddressPopup" />
  </div>
</template>
<script>
import ModalLayerPopup from '@/components/pc/popup/ModalLayerPopupNew'
import Addresses from '@/components/pc/common/AddressesNew'
import OrderDetailAddressNew from '@/components/mixins/mypage/order/detail/OrderDetailAddressNew'

export default {
  mixins: [OrderDetailAddressNew],
  components: {
    ModalLayerPopup,
    Addresses
  }
}
</script>
<style scoped>
.popup_common h1 {
  font-size: 24px !important;
  font-weight: bold !important;
  color: #3c3c3c !important;
  text-align: unset !important;
}
.delivery_memo {
  padding: 0px !important;
}
.delivery_memo input {
  color: #5a5a5a;
  font-size: 14px;
  border: 0;
  width: 83%;
}
.input_num {
  position: absolute;
  top: 0;
  right: 60px;
}
.hide_class {
  display: none;
}
</style>