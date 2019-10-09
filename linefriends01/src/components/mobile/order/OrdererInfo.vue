<template>
  <div class="customer-info order-content">
    <div class="order-input__client">
      <app-label
        target="email"
        size="normal"
      >주문자</app-label>
      <app-input
        v-model="myInput.ordererName"
        id="email"
        type="email"
        size="large"
      />
    </div>
    <div class="order-input__client">
      <app-label
        target="email"
        size="normal"
      >휴대전화</app-label>
      <app-input
        v-model="myInput.ordererContact1"
        id="email"
        type="email"
        size="large"
      />
    </div>
    <div class="order-input__client">
      <app-label
        target="email"
        size="normal"
        required
      >이메일</app-label>
      <app-input
        v-model="myInput.ordererEmail"
        id="email"
        type="email"
        size="large"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppInput from '@/components/mobile/common/input/Input'
import AppLabel from '@/components/mobile/common/form/Label'

export default {
  name: 'OrdererInfo',
  props: ['orderer'],
  components: {
    AppInput,
    AppLabel
  },
  data () {
    return {
      myInput: {
        ...this.orderer
      }
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    ordererInput () {
      return {
        ordererName: this.myInput.ordererName,
        ordererContact1: this.myInput.ordererContact1,
        ordererEmail: this.myInput.ordererEmail
      }
    },
    tempPasswordInput () {
      return null
    },
    validateRule () {
      return [
        {
          inputValue: this.myInput.emailName,
          message: '이메일 주소가 유효하지 않습니다.',
          pattern: /^[a-zA-Z0-9_.-]+$/,
          input: this.$refs.emailName
        },
        {
          inputValue: this.myInput.emailDomain,
          message: '이메일 주소가 유효하지 않습니다.',
          pattern: /^[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})*$/,
          input: this.$refs.emailDomain
        }
      ]
    }
  }
}
</script>
