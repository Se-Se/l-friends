<template>
  <table class="table_info">
    <tbody>
      <tr>
        <th>주문자</th>
        <td>{{orderer.ordererName}}</td>
      </tr>
      <tr>
        <th>휴대전화</th>
        <td>
          <span class="num">{{orderer.ordererContact1}}</span>
        </td>
      </tr>
      <tr>
        <th>
          <span class="must">이메일</span>
        </th>
        <td>
          <ul class="mail">
            <li>
              <input type="text" v-model="myInput.emailName">
            </li>
            <li class="ico">@</li>
            <li>
              <input type="text" v-model="myInput.emailDomain">
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['orderer'],
  data () {
    return {
      active: {
        domain: false
      },
      myInput: {
        emailName: this.orderer.ordererEmail.split('@')[0] || '',
        emailDomain: this.orderer.ordererEmail.split('@')[1] || ''
      }
    }
  },
  computed: {
    ordererInput () {
      return {
        ordererName: this.orderer.ordererName,
        ordererContact1: this.orderer.ordererContact1,
        ordererEmail: `${this.myInput.emailName}@${this.myInput.emailDomain}`
      }
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
  },
  methods: {
    setDomain (domain) {
      this.active.domain = false
      this.myInput.emailDomain = domain
    }
  }
}
</script>
