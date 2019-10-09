import Validator, { validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
import { telnoFormat } from '@/utils/StringUtils'
import { addClass, removeClass } from '@/utils/utils'
import ClickOutside from 'vue-click-outside'

export default {
  props: ['returnAddress', 'isShowAddress', 'requireCustomsIdNumber'],
  directives: {
    ClickOutside
  },
  data () {
    return {
      // isShowAddresses: false,
      inputMemoStatus: false,
      active: {
        receiverContact1: false,
        receiverContact2: false,
        notice: false,
        memo: false,
        popup: false
      },
      txt: {
        prefixReceiverContact1: telnoFormat(this.returnAddress.receiverContact1)[0] ? telnoFormat(this.returnAddress.receiverContact1)[0] : '선택',
        prefixReceiverContact2: telnoFormat(this.returnAddress.receiverContact2)[0] ? telnoFormat(this.returnAddress.receiverContact2)[0] : '선택'
      },
      myInput: {
        receiverName: this.returnAddress.receiverName,
        receiverZipCd: this.returnAddress.receiverZipCd,
        receiverAddress: this.returnAddress.receiverAddress,
        receiverJibunAddress: this.returnAddress.receiverJibunAddress,
        receiverDetailAddress: this.returnAddress.receiverDetailAddress,
        receiverContact1One: telnoFormat(this.returnAddress.receiverContact1)[0],
        receiverContact1Two: telnoFormat(this.returnAddress.receiverContact1)[1],
        receiverContact1Three: telnoFormat(this.returnAddress.receiverContact1)[2],
        receiverContact2One: telnoFormat(this.returnAddress.receiverContact2)[0],
        receiverContact2Two: telnoFormat(this.returnAddress.receiverContact2)[1],
        receiverContact2Three: telnoFormat(this.returnAddress.receiverContact2)[2],
        deliveryMemo: (this.returnAddress.deliveryMemo) ? this.returnAddress.deliveryMemo : '선택해주세요',
        customsIdNumber: this.returnAddress.customsIdNumber
      },
      updateFlg: true,
      bodyScrollTop: 0
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
    returnAddressInput () {
      return {
        addressNo: 0,
        receiverName: this.myInput.receiverName,
        addressName: '',
        receiverContact1: `${this.myInput.receiverContact1One}-${this.myInput.receiverContact1Two}-${this.myInput.receiverContact1Three}`,
        receiverContact2: `${this.myInput.receiverContact2One}` !== '' ? `${this.myInput.receiverContact2One}-${this.myInput.receiverContact2Two}-${this.myInput.receiverContact2Three}` : '',
        receiverZipCd: this.myInput.receiverZipCd,
        receiverAddress: this.myInput.receiverAddress,
        receiverJibunAddress: this.myInput.receiverJibunAddress,
        receiverDetailAddress: this.myInput.receiverDetailAddress,
        customsIdNumber: this.myInput.customsIdNumber,
        deliveryMemo: (this.myInput.deliveryMemo === '선택해주세요') ? '' : this.myInput.deliveryMemo,
        countryCd: 'KR'
      }
    },
    addressUpdateFlg () {
      return this.updateFlg
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
    setReturnAddress () {
      const addressValidate = new Validator(this.validateRule)
      if (addressValidate.validate()) {
        return false
      }
      this.updateFlg = true
      this.$emit('update:isShowAddress', false)
      this.active.popup = false
      this.$emit('setReturnAddress')
      removeClass(document.body, 'no_scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
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
    openOrderClaimReturnAddressPopup () {
      this.active.popup = true
      this.updateFlg = false
      this.setPrefixReceiverContact1(telnoFormat(this.returnAddress.receiverContact1)[0])
      this.setPrefixReceiverContact2(telnoFormat(this.returnAddress.receiverContact2)[0])
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
    },
    closeOrderClaimReturnAddressPopup () {
      this.$emit('update:isShowAddress', false)
      this.active.popup = false
      this.updateFlg = false
      const oldMyInput = {
        receiverName: this.returnAddress.receiverName,
        receiverZipCd: this.returnAddress.receiverZipCd,
        receiverAddress: this.returnAddress.receiverAddress,
        receiverJibunAddress: this.returnAddress.receiverJibunAddress,
        receiverDetailAddress: this.returnAddress.receiverDetailAddress,
        receiverContact1One: telnoFormat(this.returnAddress.receiverContact1)[0],
        receiverContact1Two: telnoFormat(this.returnAddress.receiverContact1)[1],
        receiverContact1Three: telnoFormat(this.returnAddress.receiverContact1)[2],
        receiverContact2One: telnoFormat(this.returnAddress.receiverContact2)[0],
        receiverContact2Two: telnoFormat(this.returnAddress.receiverContact2)[1],
        receiverContact2Three: telnoFormat(this.returnAddress.receiverContact2)[2],
        deliveryMemo: this.returnAddress.deliveryMemo,
        customsIdNumber: this.returnAddress.customsIdNumber
      }
      this.myInput = oldMyInput
      removeClass(document.body, 'no_scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
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
      // this.isShowAddresses = true
      this.closeOrderClaimReturnAddressPopup()
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
  }
}
