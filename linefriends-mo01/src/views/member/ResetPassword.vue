<template>
  <div id="container" class="login">
    <Breadcrumb :title="'パスワード再設定'"></Breadcrumb>
    <!-- ↓↓↓↓↓ 비밀번호 재설정 ↓↓↓↓↓ -->
    <div class="login-wrapper login-psw-wrapper">
      <ul class="input_list">
        <li>
          <p class="input_name password_input_name">メールアドレス(ID)</p>
          <div class="input_text"><input type="text" :class="checkEmail !== '' ? 'error' : ''" placeholder="ご登録済みのメールアドレス" v-model="email" @keypress.enter="validationCheck" @blur="emailCheck"></div>
          <p class="error-info" v-if="checkEmail !== ''">{{checkEmail}}</p>
        </li>
      </ul>
      <button class="btn btn_green password_btn" @click.prevent="validationCheck">次へ</button>
    </div>
    <!-- ↑↑↑↑↑ 비밀번호 재설정 ↑↑↑↑↑ -->

  </div>
</template>
<script>
import { checkMail } from '@/utils/validateUtils'
import Breadcrumb from '@/components/common/Breadcrumb'
export default {
  data () {
    return {
      email: '',
      checkEmail: ''
    }
  },
  components: {
    Breadcrumb
  },
  methods: {
    async emailCheck (type, nextFun) {
      let checkFlg = true
      if (!checkMail(this.email)) {
        this.checkEmail = 'メールアドレスの形式が正しくありません。'
        checkFlg = false
      }
      if (checkFlg) {
        await this.$store.dispatch('member/emailExits', this.email).then((result) => {
          if (result.data.exist !== true) {
            this.checkEmail = '入力された内容と一致する会員情報がありません。もう一度確認した後に入力してください。'
            checkFlg = false
          }
          if (checkFlg && type === 'next') {
            nextFun()
          }
        })
      }
      if (checkFlg) {
        this.checkEmail = ''
      }
      return checkFlg
    },
    validationCheck () {
      this.emailCheck('next', () => {
        this.$store.dispatch('profile/sendingEmailWithUrl', {
          memberId: this.email,
          url: `${location.protocol}//${location.host}/m/member/find/password/result?email=` + this.email
        }).then((response) => {
          this.$router.push({
            path: '/m/member/find/password/email',
            query: {
              email: this.email
            }
          })
        })
      })
    }
  }
}

</script>
