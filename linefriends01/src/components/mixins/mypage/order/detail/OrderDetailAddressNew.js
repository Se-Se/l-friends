import Validator, { validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
import { telnoFormat } from '@/utils/StringUtils'
import { deepCopy } from '@/utils/utils'
import ClickOutside from 'vue-click-outside'

export default {
  props: ['orderNo', 'shippingAddress', 'requireCustomsIdNumber', 'nonMember', 'isShowAddress'],
  directives: {
    ClickOutside
  },
  data () {
    return {
      isShowAddresses: false,
      inputMemoStatus: false,
      active: {
        receiverContact1: false,
        receiverContact2: false,
        notice: false,
        memo: false,
        popup: false
      },
      txt: {
        prefixReceiverContact1: telnoFormat(this.shippingAddress.receiverContact1)[0] ? telnoFormat(this.shippingAddress.receiverContact1)[0] : '010',
        prefixReceiverContact2: telnoFormat(this.shippingAddress.receiverContact2)[0] ? telnoFormat(this.shippingAddress.receiverContact2)[0] : '선택',
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
        deliveryMemo: ''
      }
    }
  },
  computed: {
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
    shippingAddressInput () {
      const tempInput = deepCopy(this.myInput)
      let receiverContact2 = `${tempInput.receiverContact2One}-${tempInput.receiverContact2Two}-${tempInput.receiverContact2Three}`
      receiverContact2 = receiverContact2 === '--' ? '' : receiverContact2
      return {
        addressNo: 0,
        receiverName: tempInput.receiverName,
        addressName: '',
        receiverContact1: `${tempInput.receiverContact1One}-${tempInput.receiverContact1Two}-${tempInput.receiverContact1Three}`,
        receiverContact2: receiverContact2,
        receiverZipCd: tempInput.receiverZipCd,
        receiverAddress: tempInput.receiverAddress,
        receiverJibunAddress: tempInput.receiverJibunAddress,
        receiverDetailAddress: tempInput.receiverDetailAddress,
        customsIdNumber: tempInput.customsIdNumber,
        countryCd: 'KR'
      }
    },
    deliveryMemoInput () {
      const tempInput = deepCopy(this.myInput)
      return tempInput.deliveryMemo === '선택해주세요' ? '' : tempInput.deliveryMemo
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
        const customsIdNumberRule = {
          inputValue: this.myInput.customsIdNumber,
          message: '개인통관고유부호가 유효하지 않습니다. ',
          pattern: /^[p|P]\d{12}$/,
          input: this.$refs.customsIdNumber
        }

        validateRule.push(customsIdNumberRule)
      }

      return validateRule
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
    openOrderDetailAddressPopup () {
      if (this.active.address !== false) {
        const tempInput = deepCopy(this.shippingAddress)
        this.myInput.receiverName = tempInput.receiverName
        this.myInput.receiverZipCd = tempInput.receiverZipCd
        this.myInput.receiverAddress = tempInput.receiverAddress
        this.myInput.receiverJibunAddress = tempInput.receiverJibunAddress
        this.myInput.receiverDetailAddress = tempInput.receiverDetailAddress
        this.myInput.receiverContact1One = tempInput.receiverContact1One
        this.myInput.receiverContact1Two = tempInput.receiverContact1Two
        this.myInput.receiverContact1Three = tempInput.receiverContact1Three
        this.myInput.receiverContact2One = tempInput.receiverContact2One
        this.myInput.receiverContact2Two = tempInput.receiverContact2Two
        this.myInput.receiverContact2Three = tempInput.receiverContact2Three
        this.myInput.customsIdNumber = tempInput.customsIdNumber
        this.myInput.deliveryMemo = (tempInput.deliveryMemo) ? tempInput.deliveryMemo : '선택해주세요'
        this.setDeliveryMemoLength()
      }

      this.active.popup = true
    },
    closeOrderDetailAddressPopup () {
      this.$emit('update:isShowAddress', false)
      this.active.popup = false
      this.active.address = true
      this.$emit('closePop')
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
    },
    modifyShippingAddress () {
      const addressValidate = new Validator(this.validateRule)
      if (addressValidate.validate()) {
        return false
      }
      let dispatchUrl = 'myorder/editDeliveries'
      if (this.nonMember) {
        dispatchUrl = 'guestorder/editDeliveries'
      }
      const params = {
        orderNo: this.orderNo,
        addressRequest: {
          ...this.shippingAddressInput,
          deliveryMemo: this.deliveryMemoInput
        }
      }
      this.$store.dispatch(dispatchUrl, params).then(() => {
        const tempInput = deepCopy(this.myInput)
        this.shippingAddress.receiverName = tempInput.receiverName
        this.shippingAddress.receiverZipCd = tempInput.receiverZipCd
        this.shippingAddress.receiverAddress = tempInput.receiverAddress
        this.shippingAddress.receiverJibunAddress = tempInput.receiverJibunAddress
        this.shippingAddress.receiverDetailAddress = tempInput.receiverDetailAddress
        this.shippingAddress.receiverContact1One = tempInput.receiverContact1One
        this.shippingAddress.receiverContact1Two = tempInput.receiverContact1Two
        this.shippingAddress.receiverContact1Three = tempInput.receiverContact1Three
        this.shippingAddress.receiverContact2One = tempInput.receiverContact2One
        this.shippingAddress.receiverContact2Two = tempInput.receiverContact2Two
        this.shippingAddress.receiverContact2Three = tempInput.receiverContact2Three
        this.shippingAddress.customsIdNumber = tempInput.customsIdNumber
        this.shippingAddress.deliveryMemo = (tempInput.deliveryMemo === '선택해주세요') ? '' : tempInput.deliveryMemo

        this.shippingAddress.receiverContact1 = this.shippingAddress.receiverContact1One + '-' + this.shippingAddress.receiverContact1Two + '-' + this.shippingAddress.receiverContact1Three
        this.closeOrderDetailAddressPopup()
      })
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
      this.setDeliveryMemoLength()
    },
    setDeliveryMemoLength () {
      this.txt.deliveryMemoLength = this.myInput.deliveryMemo.length
    },
    openAddressesPopup () {
      this.isShowAddresses = true
      this.closeOrderDetailAddressPopup()
      this.$refs.addresses.openAddressesPopup()
    },
    validateNumber (event) {
      validateNumber(event)
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
      }
      this.inputMemoStatus = false
    },
    closeMemo () {
      this.active.memo = false
    }
  },
  watch: {
    isShowAddress () {
      if (this.isShowAddress) this.openOrderDetailAddressPopup()
    }
  }
}
