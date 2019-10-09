<template>
  <div>
    <sub-page-header title="배송지 정보 변경" close />
    <div id="container">
      <div class="input-row">
        <app-label target="name" :required="true">
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
        <app-label target="postcode" :required="true">
          주소
        </app-label>
        <address-input v-model="address" />
      </div>
      <div class="input-row">
        <app-label target="phone" :required="true">
          휴대전화
        </app-label>
        <phone-no-input v-model="phoneNo" />
      </div>
      <div class="input-row">
        <app-label :style="{ 'line-height': 1.67 }" :required="true" target="memo">
          배송메모
        </app-label>
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

    <bottom-fixed class="button-list">
      <app-button type="secondary" @click="$emit('close')">
        취소
      </app-button>
      <app-button type="success" @click="modifyShippingAddress">
        등록
      </app-button>
    </bottom-fixed>
  </div>
</template>

<script>
import { Alert } from '@/utils/event-bus'
import { deepCopy } from '@/utils/utils'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import BottomFixed from '@/components/mobile/common/BottomFixed'
import AppButton from '@/components/mobile/common/button/Button'
import AppInput from '@/components/mobile/common/input/Input'
import AddressInput from '@/components/mobile/common/input/extra/AddressInput'
import PhoneNoInput from '@/components/mobile/common/input/extra/PhoneNoInput'
import AppLabel from '@/components/mobile/common/form/Label'
import OrderDetailAddressNew from '@/components/mixins/mypage/order/detail/OrderDetailAddressNew'

export default {
  name: 'OrderDetailAddressNew',
  mixins: [OrderDetailAddressNew],
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
  mounted () {
    this.openOrderDetailAddressPopup()
  },
  methods: {
    closeOrderDetailAddressPopup () {
      Alert({
        title: '알림',
        message: '배송지가 변경되었습니다'
      })
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 3.2rem 2rem 5rem;
}

.button-list {
  display: flex;
  justify-content: space-between;

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
  font-family: "Noto Sans KR";
  font-weight: normal;
  font-size: 1.2rem;
  letter-spacing: -0.01rem;
  line-height: 1.5;
}
.deliveryMemoSelect {
  padding: 1.5rem 1.9rem;
  height: 5rem;
  width: 100%;
  font-family: "Noto Sans KR";
  font-size: 1.4rem;
  font-weight: normal;
  color: #333;
  letter-spacing: -0.01rem;
  line-height: normal;
  width: 100%;
  -webkit-transition: border 0.2s;
  transition: border 0.2s;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.4rem;
}
</style>
