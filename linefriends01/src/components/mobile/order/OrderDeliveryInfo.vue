<template>
  <div class="delivery-info order-content">
    <order-tabs
      :value="tab"
      class="coupon-tabs"
      :tabs="{ '최근배송지': 'recent', '신규배송지': 'new' }"
      @input="clickTab"
    />
    <div class="order-tab-content">
      <div class="lately-delivery__wrapper">
        <ul
          v-if="address"
          class="lately-delivery"
        >
          <li
            v-for="(recentAddress, index) in address"
            :key="index"
            class="lately-delivery__button"
            :class="{ active: showAddressNo === recentAddress.addressNo }"
            @click="setCurrentAddress(recentAddress)"
          >
            <span class="lately-delivery__value">
              {{ cutAddressName(recentAddress.receiverName) }}
              <span
                class="lately-delivery__img"
                @click.prevent="delAddress(recentAddress)"
              />
            </span>
          </li>
        </ul>
      </div>
      <div class="order-input">
        <app-label
          target="email"
          size="normal"
          required
        >받는사람</app-label>
        <app-input
          id="email"
          v-model="myInput.receiverName"
          type="email"
          size="large"
          :readonly="tab === 'recent'"
        />
      </div>
      <div class="order-input__delivery">
        <app-label
          target="email"
          size="normal"
          required
        >주소</app-label>
        <address-input
          v-model="addressInput"
          :readonly="tab === 'recent'"
          @input="setPopupAddress"
        />
      </div>
      <div class="order-input__delivery">
        <app-label
          target="email"
          size="normal"
          required
        >휴대전화</app-label>
        <phone-no-input
          v-model="phoneInput"
          :readonly="tab === 'recent'"
        />
      </div>
      <div class="order-input__delivery">
        <app-label
          target="memo"
          size="normal"
        >배송메모</app-label>
        <app-input
          id="memo"
          type="text"
          size="large"
          v-model="myInput.deliveryMemo"
          :max="50"
          :select="[
            '부재시 경비실에 맡겨주세요',
            '깨짐 위험이 있으니 조심해 주세요',
            '현관문 앞에 놔주세요'
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OrderTabs from '@/components/mobile/order/OrderTabs'
import AppInput from '@/components/mobile/common/input/Input'
import AppLabel from '@/components/mobile/common/form/Label'
import AddressInput from '@/components/mobile/common/input/extra/AddressInput'
import PhoneNoInput from '@/components/mobile/common/input/extra/PhoneNoInput'

export default {
  name: 'OrderDeliveryInfo',
  components: {
    AppInput,
    AppLabel,
    AddressInput,
    PhoneNoInput,
    OrderTabs
  },
  props: ['address', 'defaultAdd'],
  watch: {
    tab (newVal, oldVal) {
      if (newVal === 'new') {
        this.selectAddressType('checkedNewAddress')
      } else if (newVal === 'recent') {
        this.selectAddressType('checkedRecentAddress')
      }
    }
  },
  computed: {
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
          inputValue: this.myInput.receiverContact1,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{3}-\d{3,4}-\d{4}$/,
          input: this.$refs.receiverContact1
        }
      ]

      if (this.myInput.receiverContact2) {
        const receiverContact2Rule = [
          {
            inputValue: this.myInput.receiverContact2,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{2,4}-\d{3,4}-\d{4}$/,
            input: this.$refs.receiverContact2
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
        receiverContact1: this.myInput.receiverContact1,
        receiverContact2: this.myInput.receiverContact2 === '--' ? '' : this.myInput.receiverContact2,
        receiverZipCd: this.myInput.receiverZipCd,
        receiverAddress: this.myInput.receiverAddress,
        receiverJibunAddress: this.myInput.receiverJibunAddress,
        receiverDetailAddress: this.myInput.receiverDetailAddress,
        customsIdNumber: this.myInput.customsIdNumber,
        // 주소지에 있는 countryCd를 써야하나?
        countryCd: 'KR'
      }

      return shippingAddressInput
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
        deliveryMemo: ''
      }
    }
  },
  methods: {
    clickTab (tabType) {
      this.tabFlgInit = false
      if (tabType === 'recent' && this.haveRecent) {
        this.tabFlg = true
      } else {
        this.tabFlg = false
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
          receiverContact1: '',
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
      this.updatePaymentByAddress(this.myInput.receiverAddress, this.myInput.receiverJibunAddress, this.myInput.receiverZipCd)
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
    setPopupAddress (address) {
      if (address) {
        this.updatePaymentByAddress(address.address, address.jibun, address.postcode)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lately-delivery {
  &__wrapper {
    display: flex;
    margin-bottom: 3.2rem;
  }
  &__title {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #999;
    width: 4.7rem;
  }
  &__button{
    display: inline-block;
    margin-top: 0.8rem;
    margin-right: 0.7rem;
    border-radius: 1.55rem;
    background-color: #fafafa;
    font-family: 'Noto Sans KR';
    font-size: 1.2rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #999999;
    &.active {
      background-color: #00d664;
      color: #ffffff;

      .lately-delivery__img {
        background-image: url(~@/assets/images/mobile/ic-close-active.svg);
      }

      &:nth-child(2n){
        margin-right: 0;
      }
    }
  }

  &__value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 15.4rem;
    height: 3.3rem;
    padding-left: 1.4rem;
  }

  &__img {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin-right: 1.5rem;
    background-image: url(~@/assets/images/mobile/ic-close-order.svg);
    background-size: 100% 100%;
  }
}
</style>
