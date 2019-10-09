<template>
  <div class="shipping-info">
    <div class="filter">
      <h2>配送情報</h2>
    </div>
    <!-- ↓↓↓↓↓ table_wrap ↓↓↓↓↓ -->
    <div class="table_wrap person-info">
      <table class="table_data shipping_data result">
        <colgroup>
          <col style="width: 200px;">
          <col>
        </colgroup>
        <tbody>
          <tr>
            <th>お届け先選択</th>
            <td>
              <div class="radio-select">
                <span class="bx_input">
                  <input type="radio" name="group_address" id="recent_address" :disabled="emptyAddresses" :checked="checkedRecentAddress" @change="selectAddressType('checkedRecentAddress')">
                  <label class="radio" for="recent_address"></label>
                  <label class="txt" for="recent_address">前回のお届け先</label>
                </span>
                <span class="bx_input">
                  <input type="radio" name="group_address" id="new_address" :checked="checkedNewAddress" @change="selectAddressType('checkedNewAddress')">
                  <label class="radio" for="new_address"></label>
                  <label class="txt" for="new_address">新しいお届け先</label>
                </span>
              </div>
              <dl class="lately">
                <dt>最新:<template v-if="emptyAddresses"> なし</template></dt>
                <dd v-for="(recentAddress, index) in address" :key="index">
                  <span class="bx_input">
                    <input type="radio" name="recent_group" :id="`recent_group_${index}`" :checked="currentAddress.addressNo === recentAddress.addressNo" @click="setCurrentAddress(recentAddress.addressNo)" :disabled="!checkedRecentAddress && currentAddress">
                    <label class="radio" :for="`recent_group_${index}`"></label>
                    <label class="txt" :for="`recent_group_${index}`">{{cutAddressName(recentAddress.receiverName)}}</label>
                  </span>
                  <a href="#" @click.prevent="delAddress(recentAddress.addressNo)">☓</a>
                </dd>
              </dl>
            </td>
          </tr>
          <template v-if="checkedRecentAddress && currentAddress">
            <tr>
              <th>受取人</th>
              <td>
                <p>{{this.currentAddress.receiverName}}</p>
              </td>
            </tr>
            <tr>
              <th>住所</th>
              <td>
                <p>({{this.currentAddress.receiverZipCd}}) {{this.currentAddress.receiverAddress}} {{this.currentAddress.receiverDetailAddress}}</p>
              </td>
            </tr>
            <tr>
              <th>メールアドレス</th>
              <td>
                <p>{{this.mail.ordererEmail}}</p>
              </td>
            </tr>
            <tr>
              <th>電話番号</th>
              <td>
                <p>{{this.currentAddress.receiverContact1}}</p>
              </td>
            </tr>
          </template>
          <template v-if="checkedNewAddress">
            <tr>
              <th>受取人<span class="green-point"></span></th>
              <td><input type="text" placeholder="" class="wid-220" v-model="myInput.receiverName" ref="receiverName"></td>
            </tr>
            <tr>
              <th>住所<span class="green-point"></span></th>
              <td>
                <dl class="address">
                  <dt>郵便番号</dt>
                  <dd>
                    <input type="text" placeholder="" class="wid-220" maxlength="7" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" v-model="myInput.receiverZipCd" ref="receiverZipCd">
                    <button type="button" class="btn" @click.prevent="setAddressData">検索</button>
                  </dd>
                  <dt>ご住所１(都道府県・市区町村)</dt>
                  <dd><input type="text" placeholder="" v-model="myInput.receiverAddress" ref="receiverAddress" disabled unselectable="on"></dd>
                  <dt>ご住所２(番地・その以降)</dt>
                  <dd><input type="text" placeholder="ご住所２(番地・その以降)を入力してください。" v-model="myInput.receiverDetailAddress" ref="receiverDetailAddress"></dd>
                </dl>
              </td>
            </tr>
            <tr>
              <th>メールアドレス</th>
              <td>{{this.mail.ordererEmail}}</td>
            </tr>
            <tr>
              <th>電話番号<span class="green-point"></span></th>
              <td>
                <div class="telephone">
                  <input type="text" placeholder="" class="wid-96" :maxlength="receiverContect1OneLengh" v-model="myInput.receiverContact1One" @keypress="onlyNumber" @keyup="phoneNumberCheck">
                  <span>-</span>
                  <input type="text" placeholder="" class="wid-96" :maxlength='receiverContact1TwoLengh' required="" v-model="showReceiverContact1Two" ref="receiverContact1Two" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                  <span>-</span>
                  <input type="text" placeholder="" class="wid-96" maxlength="4" required="" v-model="showReceiverContact1Three" ref="receiverContact1Three" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="this.orderProductOptions[0].reservation === false && this.deliveryStartYmt">
            <th>ご希望のお届け日
              <div class="tip">
                <div class="tip_popup size_4">
                  <div class="txt_ex">
                    <ul>
                      <!--<li>- 7日以降のお届けをご希望の場合、<br>ご希望に添えられない<br>場合もございます。</li>-->
                      <li>- 選択しない場合、<br>商品のご用意が出来次第<br>発送いたします。</li>
                    </ul>
                  </div>
                </div>
              </div>
            </th>
            <td>
              <div class="bx_select size_m" v-click-outside="closeDeliveryYmt">
                <div class="txt_select" @click.prevent="deliveryYmtSelectYn=!deliveryYmtSelectYn">
                  <span class="select_vle">{{this.myInput.deliveryWishYmd}}</span>
                  <span class="ico_arrow"></span>
                </div>
                <ul class="lst_select_content" :style="deliveryYmtSelectYn ? 'display: block;' : 'display: none'">
                  <li><a href="#" @click.prevent="setDeliveryYmt('指定なし')">指定なし</a></li>
                  <li v-for="(item, key) in this.dates" :key="key"><a href="#" @click.prevent="setDeliveryYmt(item)">{{item}}</a></li>
                </ul>
              </div>
            </td>
          </tr>
          <tr v-if="this.orderProductOptions[0].reservation === false">
            <th>ご希望のお届け時間帯</th>
            <td>
              <div class="bx_select size_m" v-click-outside="closeDeliveryTime">
                <div class="txt_select" @click.prevent="deliveryTimeSelectYn=!deliveryTimeSelectYn">
                  <span class="select_vle">{{this.deliveryTime}}</span>
                  <span class="ico_arrow"></span>
                </div>
                <ul class="lst_select_content" :style="deliveryTimeSelectYn ? 'display: block;' : 'display: none'">
                  <li><a href="#" @click.prevent="setdeliveryTimes('','')">指定なし</a></li>
                  <li v-for="(item, key) in this.dTimes" :key="key">
                    <a href="#" @click.prevent="setdeliveryTimes(item.deliveryTimeSetting,item.deliveryTimeType)">{{item.deliveryTimeSetting}}</a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr v-if="this.delivery">
            <th>配送コメント</th>
            <td>
              <div class="bx_select size_m" @click.prevent="deliveryMemoSelectYn=!deliveryMemoSelectYn" v-click-outside="closeDeliveryMemo">
                <div class="txt_select" >
                  <span class="select_vle" :style="!inputMemoStatus ? 'display: block;' : 'display: none'">{{myInput.deliveryMemo}}</span>
                  <span class="ico_arrow"></span>
                  <p class="input_area" :style="inputMemoStatus ? 'display: block;' : 'display: none'">
                  <input type="text" id='inputMemo' @blur="inputMemoBlur()" maxlength=50 v-model='myInput.deliveryMemo' style="max-width: 400px;">
                    <span class="text_count_data"><i class="num">{{myInput.deliveryMemo.length}}</i>/50</span>
                  </p>
                </div>

                <ul class="lst_select_content z2" :style="deliveryMemoSelectYn ? 'display: block;' : ''">
                  <!--<li><a href="#" @click.prevent="inputMemo()">直接入力</a></li>-->
                  <!--<li><a href="#" @click.prevent="setDeliveryMemo('留守の場合、警備室に預けてください。')">留守の場合、警備室に預けてください。</a></li>-->
                  <!--<li><a href="#" @click.prevent="setDeliveryMemo('壊れやすいものですので、注意してください。')">壊れやすいものですので、注意してください。</a></li>-->
                  <!--<li><a href="#" @click.prevent="setDeliveryMemo('玄関ドアの前に置いてください。')">玄関ドアの前に置いてください。</a></li>-->
                  <li><a href="#" @click.prevent="setDeliveryMemo('なし')">なし</a></li>
                  <li><a href="#" @click.prevent="setDeliveryMemo('不在時は宅配BOX希望')">不在時は宅配BOX希望</a></li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- ↑↑↑↑↑ table_wrap ↑↑↑↑↑ -->
    <div class="filter">
      <h2>割引情報</h2>
    </div>
    <order-coupon-apply :paymentInfo="paymentInfo" />
    <!-- ↑↑↑↑↑ table_wrap ↑↑↑↑↑ -->

  </div>
</template>

<script>
/* eslint-disable */
import OrderCouponApply from '@/components/escrow/order/OrderCouponApply'
import { validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
import { mapState, mapGetters } from 'vuex'
import { Alert } from '@/components/common/modal'
import ClickOutside from 'vue-click-outside'
import 'es6-promise/auto'
import 'babel-polyfill'
import axios from 'axios'
import $ from 'jquery'

export default {
  props: ['address', 'mail', 'paymentInfo', 'deliveryConditionNo', 'delivery', 'dTimes', 'orderProductOptions' , 'deliveryStartYmt'],
  watch: {
    address (newVal, oldVal) {
      this.address = newVal
      this.currentAddress = this.address && this.address.length > 0 ? this.address[0] : {}
    }
  },
  components: {
    OrderCouponApply
  },
  directives: {
    ClickOutside
  },
  created () {
    // console.log(this.deliveryConditionNo)
    // console.log(this.mail)
    // console.log(this.delivery)
    // console.log(this.dTimes)
    // console.log(this.paymentInfo)
    // console.log(this.orderProductOptions[0].reservation)
    this.myInput.deliveryConditionNo = this.deliveryConditionNo
    setTimeout(() => this.deliveryYmt(), 1000);
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
        prefixReceiverContact1: '080',
        prefixReceiverContact2: '選択',
        deliveryMemoLength: 0
      },
      myInput: {
        receiverName: '',
        receiverZipCd: '',
        receiverAddress: '',
        receiverJibunAddress: '12342',
        receiverDetailAddress: '',
        receiverContact1One: '',
        receiverContact1Two: '',
        receiverContact1Three: '',
        receiverContact2One: '',
        receiverContact2Two: '',
        receiverContact2Three: '',
        customsIdNumber: '',
        deliveryMemo: 'なし',
        deliveryConditionNo: this.deliveryConditionNo,
        deliveryTimeType: this.dTimes ? this.dTimes.deliveryTimeType : '',
        deliveryWishYmd: '指定なし'
      },
      phoneSelectYn: false,
      deliveryMemoSelectYn: false,
      deliveryTimeSelectYn: false,
      deliveryYmtSelectYn: false,
      // deliveryTime: this.dTimes ? this.dTimes[0].deliveryTimeSetting : '',
      deliveryTime: '指定なし',
      dates: this.deliveryStartYmt ? this.deliveryYmt : [],
      receiverContact1TwoLengh: 4,
      receiverContect1OneLengh: 5
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
        deliveryConditionNo: this.myInput.deliveryConditionNo,
        // 주소지에 있는 countryCd를 써야하나?
        countryCd: 'JP'
      }

      if (this.checkedRecentAddress) {
        shippingAddressInput = {
          ...this.currentAddress,
          deliveryConditionNo: this.myInput.deliveryConditionNo
        }
      }

      return shippingAddressInput
    },
    deliveryMemoInput () {
      return (this.myInput.deliveryMemo === 'なし') ? '' : this.myInput.deliveryMemo
    },
    deliveryWishYmdInput () {
      return this.myInput.deliveryWishYmd
    },
    deliveryTimeTypeInput () {
      return this.myInput.deliveryTimeType
    },
    validateRule () {
      let validateRule = [
        {
          inputValue: this.myInput.receiverName,
          message: '受取人を入力してください。',
          pattern: /\S+/,
          input: this.$refs.receiverName
        },
        {
          inputValue: this.myInput.receiverZipCd,
          message: '郵便番号を入力してください。',
          pattern: /^\d{3,4}$/,
          input: this.$refs.receiverDetailAddress
        },
        {
          inputValue: this.myInput.receiverAddress,
          message: '住所を入力してください。',
          pattern: /\S+/,
          input: this.$refs.receiverDetailAddress
        },
        {
          inputValue: this.myInput.receiverContact1One,
          message: '電話番号を入力してください。',
          pattern: /^\d{3}$/,
          input: this.$refs.receiverContact1One
        },
        {
          inputValue: this.myInput.receiverContact1Two,
          message: '電話番号を入力してください。',
          pattern: /^\d{3,4}$/,
          input: this.$refs.receiverContact1Two
        },
        {
          inputValue: this.myInput.receiverContact1Three,
          message: '電話番号を入力してください。',
          pattern: /^\d{4}$/,
          input: this.$refs.receiverContact1Three
        }
      ]

      if (this.myInput.receiverContact2One !== '' || this.myInput.receiverContact2Two !== '' || this.myInput.receiverContact2Three !== '') {
        const receiverContact2Rule = [
          {
            inputValue: this.myInput.receiverContact2One,
            message: '連絡先を入力してください。',
            pattern: /^\d{2,4}$/,
            input: this.$refs.receiverContact2One
          },
          {
            inputValue: this.myInput.receiverContact2Two,
            message: '連絡先を入力してください。',
            pattern: /^\d{3,4}$/,
            input: this.$refs.receiverContact2Two
          },
          {
            inputValue: this.myInput.receiverContact2Three,
            message: '連絡先を入力してください。',
            pattern: /^\d{4}$/,
            input: this.$refs.receiverContact2Three
          }
        ]
        validateRule.push(...receiverContact2Rule)
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
    closeDeliveryYmt () {
      this.deliveryYmtSelectYn = false
    },
    closeDeliveryTime () {
      this.deliveryTimeSelectYn = false
    },
    closeDeliveryMemo () {
      this.deliveryMemoSelectYn = false
    },
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
      this.phoneSelectYn = !this.phoneSelectYn
      this.active.receiverContact1 = false
      this.txt.prefixReceiverContact1 = number
      this.myInput.receiverContact1One = number
    },
    setPrefixReceiverContact2 (number) {
      this.active.receiverContact2 = false
      this.txt.prefixReceiverContact2 = number || '選択'
      this.myInput.receiverContact2One = number
    },
    setDeliveryMemo (memo) {
      this.active.memo = false
      this.myInput.deliveryMemo = memo
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
          countryCd: 'JP',
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
      if (this.myInput.deliveryMemo === '選択してください' ||
        this.myInput.deliveryMemo === '留守の場合、警備室に預けてください。' ||
        this.myInput.deliveryMemo === '壊れやすいものですので、注意してください。' ||
        this.myInput.deliveryMemo === '玄関ドアの前に置いてください。') {
        this.myInput.deliveryMemo = ''
      }
      this.$nextTick(() => {
        document.getElementById('inputMemo').focus()
      })
    },
    inputMemoBlur () {
      if (this.myInput.deliveryMemo === '') {
        this.myInput.deliveryMemo = 'なし'
      }
      this.inputMemoStatus = false
    },
    closeMemo () {
      this.active.memo = false
    },
    setAddressData () {
      if (this.myInput.receiverZipCd.length === 0 || this.myInput.receiverZipCd.length < 7) {
        Alert({
          message: '郵便番号を入力してください。'
        })
      } else {
        const _this = this
        const receiverZipCd = _this.myInput.receiverZipCd
        let url = process.env.VUE_APP_NCP_API_BASE_URL + 'address/search?zipCode=' + receiverZipCd
        // fetch(url).then(response => {
        //   return response.json();
        // }).then(res =>{
        //   this.myInput.receiverAddress = res.address
        //   this.updatePaymentByAddress(res.address, this.myInput.receiverJibunAddress, this.myInput.receiverZipCd)
        // }).catch(function (error) {
        //   Alert({
        //     message: '正しい郵便番号を入力してください。'
        //   })
        // })
        axios.get(url)
          .then(res => {
            if (res.data) {
              this.myInput.receiverAddress = res.data.address
              this.updatePaymentByAddress(res.data.address, this.myInput.receiverJibunAddress, this.myInput.receiverZipCd)
            } else {
              Alert({
                message: '正しい郵便番号を入力してください。'
              })
            }
          }).catch(error => {
            Alert({
              message: '正しい郵便番号を入力してください。'
            })
          })
      }
    },
    setdeliveryTimes (time, type) {
      this.deliveryTimeSelectYn = !this.deliveryTimeSelectYn
      // this.deliveryTime = time
      // this.myInput.deliveryTimeType = type
      if (time === '') {
        this.deliveryTime = '指定なし'
        this.myInput.deliveryTimeType = ''
      } else {
        this.deliveryTime = time
        this.myInput.deliveryTimeType = type
      }
    },
    deliveryYmt: function () {
      if (this.deliveryStartYmt) {
        this.dates = []
        let date = new Date(this.deliveryStartYmt)
        date.setDate(date.getDate() + 4)
        let year = date.getFullYear()
        // let month = date.getMonth() + 1
        let month = ('0' + (date.getMonth() + 1)).slice(-2)
        // let day = date.getDate()
        // day = day >= 10 ? day : '0' + day
        let day = ('00' + date.getDate()).slice(-2)
        let dayOfWeek = date.getDay()
        let dayOfWeekstr = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]
        // this.myInput.deliveryWishYmd = year + '-' + month + '-' + day + '(' + dayOfWeekstr + ')'
        this.myInput.deliveryWishYmd = '指定なし'
        for (let i = 1; i <= 14; i++) {
          this.dates.push(year + '-' + month + '-' + day + '(' + dayOfWeekstr + ')')
          date.setDate(date.getDate() + 1)
          year = date.getFullYear()
          // month = date.getMonth() + 1
          month = ('0' + (date.getMonth() + 1)).slice(-2)
          // day = date.getDate()
          // day = day >= 10 ? day : '0' + day
          day = ('00' + date.getDate()).slice(-2)
          dayOfWeek = date.getDay()
          dayOfWeekstr = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]
        }
      }
    },
    setDeliveryYmt (day) {
      this.deliveryYmtSelectYn = !this.deliveryYmtSelectYn
      this.myInput.deliveryWishYmd = day
    },
    onlyNumber ($event) {
      // console.log($event.keyCode); //keyCodes value
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
        $event.preventDefault()
      }
    },
    phoneNumberCheck ($event) {
      // if (this.myInput.receiverContact1One.substring(0, 1) !== '0') {
      //   Alert({
      //     message: '郵便番号を入力してください。'
      //   })
      //   this.myInput.receiverContact1One = ''
      //   return false
      // }
      switch (this.myInput.receiverContact1One.length) {
        case 5:
          this.receiverContact1TwoLengh = 1
          break
        case 4:
          this.receiverContact1TwoLengh = 2
          break
        case 3:
          this.receiverContact1TwoLengh = 4
          break
        default:
          this.receiverContact1TwoLengh = 4
          break
      }

      switch (this.myInput.receiverContact1Two.length) {
        case 4:
          this.receiverContect1OneLengh = 3
          break
        case 3:
          this.receiverContect1OneLengh = 3
          break
        case 2:
          this.receiverContect1OneLengh = 4
          break
        case 1:
          this.receiverContect1OneLengh = 5
          break
        default:
          this.receiverContect1OneLengh = 5
          break
      }
    }
  }
}
</script>
