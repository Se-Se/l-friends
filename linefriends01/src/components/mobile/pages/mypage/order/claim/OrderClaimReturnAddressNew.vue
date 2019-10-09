<template>
  <div>
    <sub-page-header
      title="수거지 정보 변경"
      close
      :onClose="() => { $emit('close') }"
    />
    <div id="container">
      <div class="input-row">
        <app-label
          target="name"
          :required="true"
        >
          받는사람
        </app-label>
        <app-input
          id="name"
          v-model="myInput.receiverName"
          type="text"
          size="large"
          placeholder="받는사람 입력"
        />
      </div>
      <div class="input-row">
        <app-label
          target="postcode"
          :required="true"
        >
          주소
        </app-label>
        <address-input v-model="address" />
      </div>
      <div class="input-row">
        <app-label
          target="phone"
          :required="true"
        >
          휴대전화
        </app-label>
        <phone-no-input v-model="phoneNo" />
      </div>
    </div>

    <bottom-fixed class="button-list">
      <app-button
        type="secondary"
        @click="$emit('close')"
      >
        취소
      </app-button>
      <app-button
        type="success"
        @click="setReturnAddress"
      >
        등록
      </app-button>
    </bottom-fixed>
  </div>
</template>

<script>
import Validator from '@/utils/validateUtils'
import { Alert } from '@/utils/event-bus'
import { deepCopy } from '@/utils/utils'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import BottomFixed from '@/components/mobile/common/BottomFixed'
import AppButton from '@/components/mobile/common/button/Button'
import AppInput from '@/components/mobile/common/input/Input'
import AddressInput from '@/components/mobile/common/input/extra/AddressInput'
import PhoneNoInput from '@/components/mobile/common/input/extra/PhoneNoInput'
import AppLabel from '@/components/mobile/common/form/Label'
import OrderClaimReturnAddressNew from '@/components/mixins/mypage/order/claim/OrderClaimReturnAddressNew'

export default {
  name: 'OrderDetailAddressNew',
  mixins: [OrderClaimReturnAddressNew],
  components: {
    SubPageHeader,
    BottomFixed,
    AppButton,
    AppInput,
    AddressInput,
    PhoneNoInput,
    AppLabel
  },
  computed: {
    address: {
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
    phoneNo: {
      get () {
        return [
          this.myInput.receiverContact1One,
          this.myInput.receiverContact1Two,
          this.myInput.receiverContact1Three
        ]
      },
      set (value) {
        if (value instanceof String) {
          value = value.split('-')
        }

        this.myInput.receiverContact1One = value[0]
        this.myInput.receiverContact1Two = value[1]
        this.myInput.receiverContact1Three = value[2]
      }
    }
  },
  methods: {
    setReturnAddress () {
      const addressValidate = new Validator(this.validateRule)
      if (addressValidate.validate()) {
        return false
      }
      this.updateFlg = true
      this.$emit('update')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 3.2rem 2rem 0;

  .button-list {
    display: flex;
    justify-content: space-between;

    &.fixed-wrap {
      padding-bottom: 2rem;
    }

    > * {
      width: 48.959%;
    }
  }

  .input-row {
    margin-bottom: 3.2rem;
  }

  .input-error {
    margin-top: 0.8rem;
    color: #ff414e;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.2rem;
    letter-spacing: -0.01rem;
    line-height: 1.5;
  }
}
</style>
