<template>
    <div class="menuItems">
        <order-tabs :value="tab" :tabs="{ '前回のお届け先': 'recent', '新しいお届け先': 'new' }" @input="clickTab" />
        <div class="saved">
            <ul class="cf" v-if="address">
                <li v-for="(recentAddress, index) in address" :key="index" :class="{ '': true, 'on': showAddressNo === recentAddress.addressNo }" @click="setCurrentAddress(recentAddress)">
                    <p class="save_data" v-if="recentAddress">{{cutAddressName(recentAddress.receiverName)}}</p>
                    <a class="btn_close"  @click.prevent="delAddress(recentAddress)" href="#"></a>
                </li>
            </ul>
        </div>
        <div class="product_item pt-16">
            <ul class="input_list">
                <li>
                    <dl>
                        <dt><span class="must">受取人</span></dt>
                        <dd>
                            <input type="text" placeholder=""  v-model="myInput.receiverName" :readonly="tab === 'recent'">
                        </dd>
                    </dl>
                </li>
                <li>
                    <dl>
                        <dt><span class="must">住所</span></dt>
                        <dd><span>郵便番号</span></dd>
                        <dd>
                          <span class="table-grid__left w-70p pr-7">
                            <input type="text" placeholder="" maxlength="7" value="722-20" :readonly="tab === 'recent'" v-model="myInput.receiverZipCd">
                          </span>
                            <span class="table-grid__right">
                            <button class="btn" :disabled="tab === 'recent'" @click.prevent="setAddressData">検索</button>
                          </span>
                        </dd>
                        <dd><span>ご住所１(都道府県・市区町村)</span></dd>
                        <dd>
                            <input type="text" disabled v-model="myInput.receiverAddress" placeholder="">
                        </dd>
                        <dd><span>ご住所２(番地・その以降)</span></dd>
                        <dd>
                            <input type="text"  :readonly="tab === 'recent'" v-model="myInput.receiverDetailAddress" placeholder="ご住所２(番地・その以降)を入力してください。">
                        </dd>
                        <dd><span>メールアドレス(ID)</span></dd>
                        <dd>
                            <input type="text" placeholder="" v-model="this.mail.ordererEmail" disabled="disabled">
                        </dd>
                    </dl>
                </li>
                <li>
                    <dl>
                        <dt><span class="must">電話番号</span></dt>
                        <dd>
                            <div class="tn">
                                <p>
                                    <input type="text" placeholder="" :maxlength="receiverContect1OneLengh" v-model="receiverContact1One" :readonly="tab === 'recent'" @keypress="onlyNumber" @keyup="phoneNumberCheck">
                                </p>
                                <p>
                                    <input type="text" placeholder="" :maxlength='receiverContact1TwoLengh' v-model="receiverContact1Two" :readonly="tab === 'recent'" @keypress="onlyNumber">
                                </p>
                                <p>
                                    <input type="text" placeholder="" maxlength="4" v-model="receiverContact1Three" :readonly="tab === 'recent'" @keypress="onlyNumber">
                                </p>
                            </div>
                        </dd>
                    </dl>
                </li>
                <li v-if="deliveryWishYmd && this.orderProductOptions[0].reservation === false && this.deliveryStartYmt">
                    <dl>
                        <dt>ご希望のお届け日</dt>
                        <dd>
                            <div class="select_normal">
                                <select class="txt_select" v-model="deliveryWishYmd" @change="changeDeliveryYmt">
                                    <option class="select_vle">指定なし</option>
                                    <option class="select_vle" v-for="(item, key) in this.dates" :key="key" :value="item">
                                        {{ item }}
                                    </option>
                                </select>
                                <span class="ico_arrow">リストを開く</span>
                            </div>
                        </dd>
                        <dd>
                            <!--<p>- 一週間後に配送すると希望が変わるかもしれません.</p>-->
                            <p>- 選択しない場合、商品のご用意が出来次第発送いたします。</p>
                        </dd>
                    </dl>
                </li>
                <li v-if="deliveryTime !== '' && this.orderProductOptions[0].reservation === false">
                    <dl>
                        <dt>ご希望のお届け時間帯</dt>
                        <dd>
                            <div class="select_normal" >
                                <select class="txt_select"  v-model="deliveryTime" @change="onChange">
                                    <option class="select_vle">指定なし</option>
                                    <option class="select_vle" v-for="(item, key) in this.dTimes" :key="key"  >{{item.deliveryTimeSetting}}</option>
                                </select>
                                <span class="ico_arrow">リストを開く</span>
                            </div>
                        </dd>
                    </dl>
                </li>
                <li v-if="this.delivery">
                    <dl>
                        <dt>配送コメント</dt>
                        <dd>
                            <div class="select_normal">
                                <select name="" id="select_memo_view" v-model="deliveryMemo" @change="onMemoChange">
                                    <!--<option value="選択してください。" >選択してください。</option>-->
                                    <!--<option value="直接入力" >直接入力</option>-->
                                    <!--<option value="留守の場合、警備室に預けてください。" >留守の場合、警備室に預けてください。</option>-->
                                    <!--<option value="壊れやすいものですので、注意してください。" >壊れやすいものですので、注意してください。</option>-->
                                    <!--<option value="玄関ドアの前に置いてください。" >玄関ドアの前に置いてください。</option>-->
                                    <option value="なし" >なし</option>
                                    <option value="不在時は宅配BOX希望" >不在時は宅配BOX希望</option>
                                    <!--<option value="留守の場合、警備室に預けてください。" >留守の場合、警備室に預けてください。</option>-->
                                    <!--<option value="壊れやすいものですので、注意してください。" >壊れやすいものですので、注意してください。</option>-->
                                    <!--<option value="玄関ドアの前に置いてください。" >玄関ドアの前に置いてください。</option>-->
                                </select>
                                <span class="ico_arrow" @click.prevent="setMemoSelected('N')">リストを開く</span>
                                <p class="input_area" :style="memoInputVisible ? 'display: block' : 'display: none;'">
                                    <input type="text" v-model="deliveryMemo" maxlength="50" @keypress="onMemoLength">
                                    <span class="text_count_data"><i class="num">{{deliveryMemoLength}}</i> / 50</span>
                                </p>
                            </div>
                        </dd>
                    </dl>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import OrderTabs from '@/components/escrow/order/OrderTabs'
import { mapState } from 'vuex'
import { Alert } from '@/components/common/modal'
import $ from 'jquery'

export default {
  name: 'OrderDeliveryInfo',
  components: {
    OrderTabs
  },
  props: ['address', 'defaultAdd', 'mail', 'deliveryConditionNo', 'delivery', 'dTimes', 'orderProductOptions', 'deliveryStartYmt'],
  watch: {
    tab (newVal, oldVal) {
      if (newVal === 'new') {
        this.selectAddressType('checkedNewAddress')
      } else if (newVal === 'recent') {
        this.selectAddressType('checkedRecentAddress')
      }
    }
  },
  created () {
    // console.log(this.deliveryConditionNo)
    // console.log(this.mail)
    // console.log(this.delivery)
    // console.log(this.dTimes)
    //   console.log(this.defaultAdd)
    this.myInput.deliveryConditionNo = this.deliveryConditionNo
    this.myInput.deliveryWishYmd = '指定なし'
    setTimeout(() => this.deliveryYmt(), 1000);
    if (this.tab === 'recent') {
        this.tabFlg = true
        this.receiverContact1One = this.phoneInput[0]
        this.receiverContact1Two = this.phoneInput[1]
        this.receiverContact1Three = this.phoneInput[2]
    }
  },
  computed: {
    ...mapState('shippingaddresses', ['recentAddresses']),
    haveRecent () {
      if (this.address && this.address.length > 0) {
        return true
      } else {
        return false
      }
    },
    tab () {
      let type = this.tabFlgInit ? this.haveRecent || this.tabFlg : this.tabFlg
      if (type) {
        return 'recent'
      } else {
        return 'new'
      }
    },
    addressInput: {
      get () {
        return {
          postcode: this.myInput.receiverZipCd,
          address: this.myInput.receiverAddress,
          detail: this.myInput.receiverDetailAddress,
          jibun: this.myInput.receiverJibunAddress
        }
      },
      set (value) {
        this.myInput.receiverZipCd = value.postcode
        this.myInput.receiverAddress = value.address
        this.myInput.receiverDetailAddress = value.detail
        this.myInput.receiverJibunAddress = value.jibun
      }
    },
    phoneInput: {
      get () {
        return this.myInput.receiverContact1.split('-')
      },
      set (value) {
        this.myInput.receiverContact1 = value.join('-')
      }
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
          pattern: /\S+/,
          input: this.$refs.receiverDetailAddress
        },
        {
          inputValue: this.myInput.receiverAddress,
          message: '住所を入力してください。',
          pattern: /\S+/,
          input: this.$refs.receiverDetailAddress
        },
        {
          inputValue: this.myInput.receiverContact1,
          message: '電話番号を入力してください。',
          pattern: /^\d{3}-\d{3,4}-\d{4}$/,
          input: this.$refs.receiverContact1
        }
      ]

      if (this.myInput.receiverContact2) {
        const receiverContact2Rule = [
          {
            inputValue: this.myInput.receiverContact2,
            message: '連絡先を入力してください。',
            pattern: /^\d{2,4}-\d{3,4}-\d{4}$/,
            input: this.$refs.receiverContact2
          }
        ]
        validateRule.push(...receiverContact2Rule)
      }

      if (this.requireCustomsIdNumber) {
        const customsIdNumberRule = [{
          inputValue: this.myInput.customsIdNumber,
          message: '個人通関固有符号が有效ではないです。',
          pattern: /^[p|P]\d{12}$/,
          input: this.$refs.customsIdNumber
        }]
        validateRule.push(...customsIdNumberRule)

        return this.tab === 'new' ? validateRule : this.currentAddress.customsIdNumber ? [] : customsIdNumberRule
      } else {
        return this.tab === 'new' ? validateRule : []
      }
    },
    shippingAddressInput () {
      let shippingAddressInput = {
        addressNo: this.tab === 'new' ? 0 : this.showAddressNo,
        receiverName: this.myInput.receiverName,
        addressName: '',
        receiverContact1: this.receiverContact1One + '-' + this.receiverContact1Two + '-' + this.receiverContact1Three,
        receiverContact2: this.myInput.receiverContact2 === '--' ? '' : this.myInput.receiverContact2,
        receiverZipCd: this.myInput.receiverZipCd,
        receiverAddress: this.myInput.receiverAddress,
        receiverJibunAddress: this.myInput.receiverJibunAddress,
        receiverDetailAddress: this.myInput.receiverDetailAddress,
        customsIdNumber: this.myInput.customsIdNumber,
        deliveryConditionNo: this.myInput.deliveryConditionNo,
        // 주소지에 있는 countryCd를 써야하나?
        countryCd: 'JP'
      }

      return shippingAddressInput
    },
    receiverContact1Input () {
      let receiverContact1Input = {}
      receiverContact1Input.phone1 = this.receiverContact1One
        receiverContact1Input.phone2 = this.receiverContact1Two
        receiverContact1Input.phone3 = this.receiverContact1Three
        return receiverContact1Input
    },
    deliveryMemoInput () {
      let deliveryMemoInput = {}
      deliveryMemoInput = this.deliveryMemo
      return deliveryMemoInput
    },
    deliveryWishYmdInput () {
      let deliveryWishYmdInput = {}
      deliveryWishYmdInput = this.deliveryWishYmd.substring(0, 10)
      return deliveryWishYmdInput
    },
    deliveryTimeTypeInput () {
      let deliveryTimeTypeInput = {}
      deliveryTimeTypeInput = this.myInput.deliveryTimeType
      return deliveryTimeTypeInput
    },
    memoLength () {
      return this.deliveryMemoLength = this.deliveryMemo.length
    }
  },
  data () {
    return {
      tabFlgInit: true,
      tabFlg: false,
      showAddressNo: this.defaultAdd ? this.defaultAdd.addressNo : 0,
      myInput: {
        receiverName: this.defaultAdd ? this.defaultAdd.receiverName : '',
        receiverZipCd: this.defaultAdd ? this.defaultAdd.receiverZipCd : '',
        receiverAddress: this.defaultAdd ? this.defaultAdd.receiverAddress : '',
        receiverJibunAddress: this.defaultAdd ? this.defaultAdd.receiverJibunAddress : '',
        receiverDetailAddress: this.defaultAdd ? this.defaultAdd.receiverDetailAddress : '',
        customsIdNumber: this.defaultAdd ? this.defaultAdd.customsIdNumber : '',
        receiverContact1: this.defaultAdd ? this.defaultAdd.receiverContact1 : '',
        receiverContact2: this.defaultAdd ? this.defaultAdd.receiverContact2 : '',
        deliveryConditionNo: this.deliveryConditionNo,
        deliveryTimeType: this.dTimes ? this.dTimes.deliveryTimeType : ''
      },
      deliveryYmtSelectYn: false,
      deliveryMemoSelectYn: false,
      deliveryTimeSelectYn: false,
      deliveryTime: '指定なし',
      deliveryMemoLength: 0,
      memoInputVisible: false,
      deliveryWishYmd: '指定なし',
      deliveryMemo: 'なし',
      receiverContact1TwoLengh: 4,
      receiverContect1OneLengh: 5,
      receiverContact1One: '',
      receiverContact1Two: '',
      receiverContact1Three: '',
      dates: this.deliveryStartYmt ? this.deliveryYmt : [],
    }
  },
  methods: {
    clickTab (tabType) {
      this.tabFlgInit = false
      if (tabType === 'recent' && this.haveRecent) {
        this.tabFlg = true
        this.deliveryMemo = 'なし'
        this.deliveryWishYmd = '指定なし'
        this.receiverContact1One = this.phoneInput[0]
        this.receiverContact1Two = this.phoneInput[1]
        this.receiverContact1Three = this.phoneInput[2]
      } else {
        this.tabFlg = false
        this.deliveryMemo = 'なし'
        this.deliveryWishYmd = '指定なし'
        // this.phoneInput[0] = ''
        // this.phoneInput[1] = ''
        // this.phoneInput[2] = ''
          this.receiverContact1One = ''
          this.receiverContact1Two = ''
          this.receiverContact1Three = ''
      }
    },
    selectAddressType (type) {
      if (type === 'checkedRecentAddress') {
        if (this.address && this.address.length > 0) {
          let tempAdd = this.address.find(item => item.addressNo === this.showAddressNo)
          if (tempAdd) {
            this.setCurrentAddress(tempAdd)
          } else {
            this.setCurrentAddress(this.address[0])
          }
        }
      } else if (type === 'checkedNewAddress') {
        this.myInput = {
          receiverName: '',
          receiverZipCd: '',
          receiverAddress: '',
          receiverJibunAddress: '',
          receiverDetailAddress: '',
          receiverContact1: this.receiverContact1One + '-' + this.receiverContact1Two + '-' + this.receiverContact1Three,
          receiverContact2: '',
          customsIdNumber: ''
        }
      }
    },
    cutAddressName (addrName) {
      addrName = addrName.trim()
      if (addrName.length < 5) {
        return addrName
      }
      const name = addrName.substr(0, 4) + '...'
      return name
    },
    setCurrentAddress (item) {
      if (this.tabFlg) {
          this.showAddressNo = item.addressNo
          this.myInput = {
              receiverName: item.receiverName,
              receiverZipCd: item.receiverZipCd,
              receiverAddress: item.receiverAddress,
              receiverJibunAddress: item.receiverJibunAddress,
              receiverDetailAddress: item.receiverDetailAddress,
              receiverContact1: item.receiverContact1,
              receiverContact2: item.receiverContact2,
              customsIdNumber: item.customsIdNumber
          }
          this.receiverContact1One = this.phoneInput[0]
          this.receiverContact1Two = this.phoneInput[1]
          this.receiverContact1Three = this.phoneInput[2]
          this.updatePaymentByAddress(this.myInput.receiverAddress, this.myInput.receiverJibunAddress, this.myInput.receiverZipCd)
      }
    },
    delAddress (item) {
      const _this = this
      this.$store.dispatch('shippingaddresses/deleteRecentAddresses', item.addressNo).then(() => {
        if (item.addressNo === _this.showAddressNo && _this.address.length) {
          _this.setCurrentAddress(_this.address[0])
        }
        if (_this.address.length === 0) {
          _this.tabFlg = false
          _this.myInput = {
            receiverName: '',
            receiverZipCd: '',
            receiverAddress: '',
            receiverJibunAddress: '',
            receiverDetailAddress: '',
            receiverContact1: '',
            receiverContact2: '',
            customsIdNumber: ''
          }
        }
      })
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
    setPopupAddress (address) {
      if (address) {
        this.updatePaymentByAddress(address.address, address.jibun, address.postcode)
      }
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
        fetch(url).then(response => {
          return response.json()
        }).then(res => {
          this.myInput.receiverAddress = res.address
          this.updatePaymentByAddress(res.address, res.jibun, res.postcode)
        }).catch(function (error) {
          Alert({
            message: '正しい郵便番号を入力してください。'
          })
        })
      }
    },
    deliveryYmt: function () {
      if (this.deliveryStartYmt) {
        this.dates = []
        let date = new Date(this.deliveryStartYmt)
        date.setDate(date.getDate() + 4)
        let year = date.getFullYear()
        let month = ('0' + (date.getMonth() + 1)).slice(-2)
        // let day = date.getDate()
        // day = day >= 10 ? day : '0' + day
        let day = ('00' + date.getDate()).slice(-2)
        let dayOfWeek = date.getDay()
        let dayOfWeekstr = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]
        // this.myInput.deliveryWishYmd = year + '-' + month + '-' + day + '(' + dayOfWeekstr + ')'
        this.deliveryWishYmd = '指定なし'
        for (let i = 1; i <= 14; i++) {
          this.dates.push(year + '-' + month + '-' + day + '(' + dayOfWeekstr + ')')
          date.setDate(date.getDate() + 1)
          year = date.getFullYear()
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
      this.deliveryWishYmd = day
    },
    changeDeliveryYmt (e) {
      this.deliveryWishYmd = e.target.value
    },
    setdeliveryTimes: function (time, type) {
      this.deliveryTimeSelectYn = !this.deliveryTimeSelectYn
      this.deliveryTime = time
      this.myInput.deliveryTimeType = type
    },
    setMemoSelected (YN) {
      if (YN === 'Y') {
        this.deliveryMemo = 'なし'
        this.memoInputVisible = true
      } else {
        this.memoInputVisible = false
        this.deliveryMemo = 'なし'
      }
    },
    setDeliveryMemo (txt) {
      this.deliveryMemo = txt
    },
    getDeliveryInputLenght () {
      this.deliveryMemoLength = this.myInput.deliveryMemo.length
    },
    onChange (e) {
      const options = this.dTimes.find((item) => {
        if (this.deliveryTime === item.deliveryTimeSetting) {
          return item.deliveryTimeType
        }
      })
      this.myInput.deliveryTimeType = options.deliveryTimeType
    },
    onMemoChange (e) {
      if (this.deliveryMemo === '直接入力') {
        this.deliveryMemo = ''
        this.memoInputVisible = true
      }
      this.deliveryMemo = e.target.value
    },
    onMemoLength () {
      let count = this.deliveryMemo.length
      this.deliveryMemoLength = count
    },
    onlyNumber ($event) {
      // console.log($event.keyCode); //keyCodes value
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
        $event.preventDefault()
      }
    },
    phoneNumberCheck ($event) {
      switch (this.receiverContact1One.length) {
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

      switch (this.receiverContact1Two.length) {
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

<style lang="scss" scoped>
    .txt_select {
        width: 100%;
        height: 5.2rem;
        list-style: none;
        position: absolute;
        border: none;
        appearance: none;
          -moz-appearance: none;
          -webkit-appearance: none;
        padding-left: 12px;
    }
    /*.ico_arrow {*/
        /*right: 2rem !important;*/
    /*}*/
</style>
