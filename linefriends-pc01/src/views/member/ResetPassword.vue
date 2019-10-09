<template>
  <div id="container" class="login">
    <div class="wrap">
      <BreadCrumbs :breadCrumbs="'パスワード再設定'"></BreadCrumbs>
      <!-- ↓↓↓↓↓ 비밀번호 재설정 ↓↓↓↓↓ -->
      <div class="login-wrapper">
        <h2>パスワード再設定</h2>
        <ul class="input_list">
          <li>
            <p class="input_name">メールアドレス(ID)</p>
            <div class="input_text"><input type="text" :class="checkEmail !== '' ? 'error' : ''" placeholder="ご登録済みのメールアドレス" v-model="email" @keypress.enter="validationCheck" @blur="emailCheck"></div>
          </li>
        </ul>
        <p class="error-info" v-if="checkEmail !== ''">{{checkEmail}}</p>
        <button class="btn btn_green mar-top-32" @click.prevent="validationCheck">次へ</button>
      </div>
      <!-- ↑↑↑↑↑ 비밀번호 재설정 ↑↑↑↑↑ -->
    </div>

  </div>
</template>
<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'
import { checkMail } from '@/utils/validateUtils'
export default {
  data () {
    return {
      email: '',
      checkEmail: ''
    }
  },
  components: {
    BreadCrumbs
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
          url: `${location.protocol}//${location.host}/member/find/password/result?email=` + this.email
        }).then((response) => {
          this.$router.push({
            path: '/member/find/password/email',
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
