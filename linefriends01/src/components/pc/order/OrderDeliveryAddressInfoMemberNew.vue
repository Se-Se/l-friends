<template>
  <div>
    <div class="info_com">
      <h2 class="ttl_h2">배송 정보</h2>
      <table class="table_info">
        <tbody>
          <tr>
            <th>배송지 선택</th>
            <td>
              <div class="address_con">
                <ul class="address">
                  <li>
                    <span class="bx_input">
                      <input type="radio" name="group_address" id="recent_address" :disabled="emptyAddresses" :checked="checkedRecentAddress" @change="selectAddressType('checkedRecentAddress')">
                      <label for="recent_address">최근배송지</label>
                    </span>
                  </li>
                  <li>
                    <span class="bx_input">
                      <input type="radio" name="group_address" id="new_address" :checked="checkedNewAddress" @change="selectAddressType('checkedNewAddress')">
                      <label for="new_address">신규배송지</label>
                    </span>
                  </li>
                </ul>
                <div class="record">
                  <p class="ttl">최근 :<template v-if="emptyAddresses"> 없음</template></p>
                  <ul class="address">
                    <li v-for="recentAddress, index in address" v-if="currentAddress">
                      <span class="bx_input">
                        <input type="radio" name="recent_group" :id="`recent_group_${index}`" :checked="currentAddress.addressNo === recentAddress.addressNo" @click="setCurrentAddress(recentAddress.addressNo)">
                        <label :for="`recent_group_${index}`">{{cutAddressName(recentAddress.receiverName)}}</label>
                        <button class="btn_del" @click.prevent="delAddress(recentAddress.addressNo)">delete</button>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
          <template v-if="checkedRecentAddress && currentAddress">
            <tr>
              <th>받는사람</th>
              <td>{{this.currentAddress.receiverName}}</td>
            </tr>
            <tr>
              <th>주소</th>
              <td><span class="num">({{this.currentAddress.receiverZipCd}})</span> {{this.currentAddress.receiverAddress}} {{this.currentAddress.receiverDetailAddress}}</td>
            </tr>
            <tr>
              <th>휴대전화</th>
              <td><span class="num">{{this.currentAddress.receiverContact1}}</span></td>
            </tr>
            <tr v-if="requireCustomsIdNumber">
              <th>
                개인통관고유부호
                <div class="tip">
                  <div class="tip_popup size_4">
                    <p>해외직배송 상품 구매 시 국내 통관 절차를 위해
                      ‘개인통관고유부호’를 제출해야 합니다.</p>
                  </div>
                </div>
              </th>
              <td>
                <template v-if="this.currentAddress.customsIdNumber">
                  <span class="num">{{this.currentAddress.customsIdNumber}}</span>
                </template>
                <template v-else="">
                  <div class="table-grid">
                    <div class="table-grid__left width-330 input_con">
                      <input type="text" maxlength="13" placeholder="받는사람의 개인통관고유부호 입력" v-model="myInput.customsIdNumber" ref="customsIdNumber">
                    </div>
                    <div class="table-grid__right align-middle">
                      <p class="link_arr">
                        <a class="link_gray" href="https://unipass.customs.go.kr/csp/persIndex.do" target="_blank">개인통관고유부호 발급</a>
                      </p>
                    </div>
                  </div>
                </template>
              </td>
            </tr>
          </template>
          <template v-if="checkedNewAddress">
            <tr>
              <th><span class="must">받는사람</span></th>
              <td>
                <div class="input_size_2">
                  <input type="text" required="" v-model="myInput.receiverName" ref="receiverName">
                </div>
              </td>
            </tr>
            <tr>
              <th><span class="must">주소</span></th>
              <td>
                <ul class="input_list">
                  <li class="input_size_2">
                    <input type="text" disabled="" v-model="myInput.receiverZipCd" ref="receiverZipCd">
                    <button class="btn btn_gray2" @click.prevent="openAddressesPopup">우편번호</button>
                  </li>
                  <li>
                    <input type="text" disabled="" v-model="myInput.receiverAddress" ref="receiverAddress">
                  </li>
                  <li>
                    <input type="text" v-model="myInput.receiverDetailAddress" ref="receiverDetailAddress">
                  </li>
                </ul>
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
                        <li>
                          <a href="#" @click.prevent="setPrefixReceiverContact1('010')">010</a>
                        </li>
                        <li>
                          <a href="#" @click.prevent="setPrefixReceiverContact1('011')">011</a>
                        </li>
                        <li>
                          <a href="#" @click.prevent="setPrefixReceiverContact1('016')">016</a>
                        </li>
                        <li>
                          <a href="#" @click.prevent="setPrefixReceiverContact1('017')">017</a>
                        </li>
                        <li>
                          <a href="#" @click.prevent="setPrefixReceiverContact1('018')">018</a>
                        </li>
                        <li>
                          <a href="#" @click.prevent="setPrefixReceiverContact1('019')">019</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="table-grid__left width-94 input_con">
                    <input type="text" maxlength="4" required="" v-model="showReceiverContact1Two" ref="receiverContact1Two" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber" style="width:100px;">
                  </div>
                  <div class="table-grid__left width-94 input_con">
                    <input type="text" maxlength="4" required="" v-model="showReceiverContact1Three" ref="receiverContact1Three" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="requireCustomsIdNumber">
              <th>
                <span class="must">개인통관고유부호
                  <div class="tip">
                    <div class="tip_popup size_4">
                      <p>해외직배송 상품 구매 시 국내 통관 절차를 위해
                        ‘개인통관고유부호’를 제출해야 합니다.</p>
                    </div>
                  </div>
                </span>
              </th>
              <td>
                <div class="table-grid">
                  <div class="table-grid__left width-330 input_con">
                    <input type="text" maxlength="13" placeholder="받는사람의 개인통관고유부호 입력" v-model="myInput.customsIdNumber" ref="customsIdNumber">
                  </div>
                  <div class="table-grid__right align-middle">
                    <p class="link_arr">
                      <a class="link_gray" href="https://unipass.customs.go.kr/csp/persIndex.do" target="_blank">개인통관고유부호 발급</a>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <tr>
            <th>배송메모</th>
            <td>
              <div class="bx_select" v-click-outside="closeMemo">
                <a :class="inputMemoShow">
                  <input type="text" id='inputMemo' @blur="inputMemoBlur()"  maxlength=50 v-model='myInput.deliveryMemo' style="max-width: 400px;">
                  <span class="input_num">{{myInput.deliveryMemo.length}}/50</span>
                  <span class="ico_arrow" v-toggle="active.memo">목록 열기</span>
                </a>
                <a v-toggle="active.memo" :class="txtSelectShow">
                  {{myInput.deliveryMemo}}
                  <span class="ico_arrow">목록 열기</span>
                </a>
                <ul class="lst_select_content">
                  <li><a href="#" @click.prevent="inputMemo()" >직접입력</a></li>
                  <li><a href="#" @click.prevent="setDeliveryMemo('부재중 시 경비실에 맡겨주세요')">부재중 시 경비실에 맡겨주세요</a></li>
                  <li><a href="#" @click.prevent="setDeliveryMemo('깨짐 위험이 있으니 조심해 주세요')">깨짐 위험이 있으니 조심해 주세요</a></li>
                  <li><a href="#" @click.prevent="setDeliveryMemo('현관문 앞에 놔주세요')">현관문 앞에 놔주세요</a></li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AddressesNew @setPopupAddress="setPopupAddress" ref="addresses" @openFather="() => {}"/>
  </div>
</template>

<script>
import AddressesNew from '@/components/pc/common/AddressesNew'
import { validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
import { mapState } from 'vuex'
import ClickOutside from 'vue-click-outside'
import $ from 'jquery'

export default {
  props: ['address', 'requireCustomsIdNumber'],
  watch: {
    address (newVal, oldVal) {
      this.address = newVal
      this.currentAddress = this.address && this.address.length > 0 ? this.address[0] : {}
    }
  },
  components: {
    AddressesNew
  },
  directives: {
    ClickOutside
  },
  data () {
    return {
      checkedRecentAddressValue: true,
      checkedNewAddressValue: false,
      inputMemoStatus: false,
      currentAddress: this.address && this.address.length > 0 ? this.address[0] : {},
      active: {
        receiverContact1: false,
        receiverContact2: false,
        memo: false,
        notice: false
      },
      txt: {
        prefixReceiverContact1: '010',
        prefixReceiverContact2: '선택',
        deliveryMemoLength: 0
      },
      myInput: {
        receiverName: '',
        receiverZipCd: '',
        receiverAddress: '',
        receiverJibunAddress: '',
        receiverDetailAddress: '',
        receiverContact1One: '010',
        receiverContact1Two: '',
        receiverContact1Three: '',
        receiverContact2One: '',
        receiverContact2Two: '',
        receiverContact2Three: '',
        customsIdNumber: '',
        deliveryMemo: '선택해주세요'
      }
    }
  },
  computed: {
    ...mapState('shippingaddresses', ['recentAddresses']),
    showReceiverContact1Two: {
      get () {
        return this.myInput.receiverContact1Two
      },
      set (value) {
        this.myInput.receiverContact1Two = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact1Three: {
      get () {
        return this.myInput.receiverContact1Three
      },
      set (value) {
        this.myInput.receiverContact1Three = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact2Two: {
      get () {
        return this.myInput.receiverContact2Two
      },
      set (value) {
        this.myInput.receiverContact2Two = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact2Three: {
      get () {
        return this.myInput.receiverContact2Three
      },
      set (value) {
        this.myInput.receiverContact2Three = changeKoreanToEmptyString(value)
      }
    },
    emptyAddresses () {
      return this.address && this.address.length === 0
    },
    checkedRecentAddress: {
      get () {
        return !this.emptyAddresses && this.checkedRecentAddressValue
      },
      set (value) {
        this.checkedRecentAddressValue = value
      }
    },
    checkedNewAddress: {
      get () {
        return this.emptyAddresses || this.checkedNewAddressValue
      },
      set (value) {
        this.checkedNewAddressValue = value
      }
    },
    shippingAddressInput () {
      let receiverContact2 = `${this.myInput.receiverContact2One}-${this.myInput.receiverContact2Two}-${this.myInput.receiverContact2Three}`
      receiverContact2 = receiverContact2 === '--' ? '' : receiverContact2
      let shippingAddressInput = {
        addressNo: 0,
        receiverName: this.myInput.receiverName,
        addressName: '',
        receiverContact1: `${this.myInput.receiverContact1One}-${this.myInput.receiverContact1Two}-${this.myInput.receiverContact1Three}`,
        receiverContact2: receiverContact2,
        receiverZipCd: this.myInput.receiverZipCd,
        receiverAddress: this.myInput.receiverAddress,
        receiverJibunAddress: this.myInput.receiverJibunAddress,
        receiverDetailAddress: this.myInput.receiverDetailAddress,
        customsIdNumber: this.myInput.customsIdNumber,
        // 주소지에 있는 countryCd를 써야하나?
        countryCd: 'KR'
      }

      if (this.checkedRecentAddress) {
        shippingAddressInput = {
          ...this.currentAddress
        }
        if (this.requireCustomsIdNumber && !this.currentAddress.customsIdNumber) {
          shippingAddressInput.customsIdNumber = this.myInput.customsIdNumber
        }
      }

      return shippingAddressInput
    },
    deliveryMemoInput () {
      return (this.myInput.deliveryMemo === '선택해주세요') ? '' : this.myInput.deliveryMemo
    },
    validateRule () {
      let validateRule = [
        {
          inputValue: this.myInput.receiverName,
          message: '받는사람을 입력해주세요.',
          pattern: /\S+/,
          input: this.$refs.receiverName
        },
        {
          inputValue: this.myInput.receiverZipCd,
          message: '주소를 입력해주세요.',
          pattern: /\S+/,
          input: this.$refs.receiverDetailAddress
        },
        {
          inputValue: this.myInput.receiverAddress,
          message: '주소를 입력해주세요.',
          pattern: /\S+/,
          input: this.$refs.receiverDetailAddress
        },
        {
          inputValue: this.myInput.receiverContact1One,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{3}$/,
          input: this.$refs.receiverContact1One
        },
        {
          inputValue: this.myInput.receiverContact1Two,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{3,4}$/,
          input: this.$refs.receiverContact1Two
        },
        {
          inputValue: this.myInput.receiverContact1Three,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{4}$/,
          input: this.$refs.receiverContact1Three
        }
      ]

      if (this.myInput.receiverContact2One !== '' || this.myInput.receiverContact2Two !== '' || this.myInput.receiverContact2Three !== '') {
        const receiverContact2Rule = [
          {
            inputValue: this.myInput.receiverContact2One,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{2,4}$/,
            input: this.$refs.receiverContact2One
          },
          {
            inputValue: this.myInput.receiverContact2Two,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{3,4}$/,
            input: this.$refs.receiverContact2Two
          },
          {
            inputValue: this.myInput.receiverContact2Three,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{4}$/,
            input: this.$refs.receiverContact2Three
          }
        ]
        validateRule.push(...receiverContact2Rule)
      }

      if (this.requireCustomsIdNumber) {
        const customsIdNumberRule = [{
          inputValue: this.myInput.customsIdNumber,
          message: '개인통관고유부호가 유효하지 않습니다. ',
          pattern: /^[p|P]\d{12}$/,
          input: this.$refs.customsIdNumber
        }]
        validateRule.push(...customsIdNumberRule)

        return this.checkedNewAddress ? validateRule : this.currentAddress.customsIdNumber ? [] : customsIdNumberRule
      } else {
        return this.checkedNewAddress ? validateRule : []
      }
    },
    inputMemoShow () {
      return {
        'hide_class': !this.inputMemoStatus,
        'on': this.active.memo,
        'txt_select': true,
        'delivery_memo': this.inputMemoStatus
      }
    },
    txtSelectShow () {
      return {
        'hide_class': this.inputMemoStatus,
        'on': this.active.memo,
        'txt_select': true
      }
    }
  },
  methods: {
    selectAddressType (type) {
      if (type === 'checkedRecentAddress') {
        this.checkedRecentAddress = true
        this.checkedNewAddress = false
        this.currentAddress = this.address && this.address.length > 0 ? this.address[0] : {}
      } else if (type === 'checkedNewAddress') {
        this.checkedRecentAddress = false
        this.checkedNewAddress = true
        this.currentAddress = {}
      }
    },
    setCurrentAddress (addressNo) {
      this.currentAddress = this.address.filter(item => item.addressNo === addressNo)[0]
      this.updatePaymentByAddress(this.currentAddress.receiverAddress, this.currentAddress.receiverJibunAddress, this.currentAddress.receiverZipCd)
    },
    delAddress (addressNo) {
      const _this = this
      this.$store.dispatch('shippingaddresses/deleteRecentAddresses', addressNo).then(() => {
        if (_this.address.length > 0) {
          this.currentAddress = _this.address[0]
        } else {
          this.currentAddress = {}
        }
      })
    },
    setPopupAddress (type, zipCode, address, jibunAddress, detailAddress) {
      this.active.address = false
      this.myInput.receiverZipCd = zipCode
      if (type === 'address') {
        this.myInput.receiverAddress = address
      } else {
        this.myInput.receiverAddress = jibunAddress
      }
      this.myInput.receiverJibunAddress = jibunAddress
      this.myInput.receiverDetailAddress = detailAddress
      this.updatePaymentByAddress(address, jibunAddress, zipCode)
    },
    setPrefixReceiverContact1 (number) {
      this.active.receiverContact1 = false
      this.txt.prefixReceiverContact1 = number
      this.myInput.receiverContact1One = number
    },
    setPrefixReceiverContact2 (number) {
      this.active.receiverContact2 = false
      this.txt.prefixReceiverContact2 = number || '선택'
      this.myInput.receiverContact2One = number
    },
    setDeliveryMemo (memo) {
      this.active.memo = false
      this.myInput.deliveryMemo = memo
      this.inputMemoStatus = false
      this.setDeliveryMemoLength()
    },
    setDeliveryMemoLength () {
      this.txt.deliveryMemoLength = this.myInput.deliveryMemo.length
    },
    openAddressesPopup () {
      // $('html').css('overflow', 'hidden')
      this.$refs.addresses.openAddressesPopup()
    },
    validateNumber (event) {
      validateNumber(event)
    },
    updatePaymentByAddress (address, jibunAddress, zipCode) {
      const addressRequest = {
        addressRequest: {
          addressType: 'RECENT',
          countryCd: 'KR',
          customsIdNumber: '',
          defaultYn: '',
          receiverAddress: address,
          receiverContact1: '',
          receiverContact2: '',
          receiverDetailAddress: '',
          receiverJibunAddress: jibunAddress,
          receiverName: '',
          receiverZipCd: zipCode
        }
      }
      const orderSheetNo = this.$store.state.route.params.orderSheetNo
      this.$store.dispatch('ordersheet/calculateOrderConpons', { orderSheetNo, addressRequest })
      this.$emit('changeAccumulationAmt', 0)
    },
    cutAddressName (addrName) {
      addrName = addrName.trim()
      if (addrName.length < 5) {
        return addrName
      }
      const name = addrName.substr(0, 4) + '...'
      return name
    },
    inputMemo () {
      this.inputMemoStatus = true
      this.active.memo = false
      if (this.myInput.deliveryMemo === '선택해주세요' ||
          this.myInput.deliveryMemo === '부재중 시 경비실에 맡겨주세요' ||
          this.myInput.deliveryMemo === '깨짐 위험이 있으니 조심해 주세요' ||
          this.myInput.deliveryMemo === '현관문 앞에 놔주세요') {
        this.myInput.deliveryMemo = ''
      }
      this.$nextTick(() => {
        document.getElementById('inputMemo').focus()
      })
    },
    inputMemoBlur () {
      if (this.myInput.deliveryMemo === '') {
        this.myInput.deliveryMemo = '선택해주세요'
        this.inputMemoStatus = false
      } else {
        if (this.myInput.deliveryMemo === '부재중 시 경비실에 맡겨주세요' ||
            this.myInput.deliveryMemo === '깨짐 위험이 있으니 조심해 주세요' ||
            this.myInput.deliveryMemo === '현관문 앞에 놔주세요') {
          this.myInput.deliveryMemo = ''
          this.inputMemoStatus = false
        } else {
          this.inputMemoStatus = true
        }
      }
    },
    closeMemo () {
      this.active.memo = false
    }
  }
}
</script>
<style scoped>
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
    display: none
  }
</style>

