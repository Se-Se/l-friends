<template>
  <div id="container" class="login">
    <div class="wrap_category" v-if="status">
      <h2>会員登録完了</h2>
    </div>
    <div class="login-wrapper login-psw-wrapper" v-if="status">
      <div class="password-wrapper pt-0">
        <dl class="password-success mt-little">
          <dt><img class="login_over_img" src="~@/assets/img/login/img_signout.png" alt=""></dt>
          <dd><strong>{{memberId}}</strong><br>様、ご登録いただきありがとうございます。</dd>
        </dl>
        <ul class="password-btn">
          <li>
            <button @click="goHome" class="btn btn_green fixed_btn">トップページへ</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Confirm } from '@/components/common/modal'
export default {
  name: 'JoinComplete',
  data () {
    return {
      status: false
    }
  },
  computed: {
    memberId () {
      return this.$route.query.email
    }
  },
  methods: {
    goHome () {
      this.$router.replace({ path: '/m' })
    }
  },
  mounted () {
    if (this.$route.query.cn) {
      let email = this.$route.query.email
      this.$store.dispatch('authentication/confirmMailCode', {
        email: email,
        cn: this.$route.query.cn
      }).then((response) => {
        if (response === 'MA0002') {
          Confirm({
            title: 'お知らせ',
            message: 'メールアドレス確認が完了していません。</br> 再送が必要な場合は再送信ボタンを押してください。',
            confirm: '再送信'
          }).then((res) => {
            if (res) {
              this.$store.dispatch('authentication/sendMailCode', {
                email: email,
                uri: `${location.protocol}//${location.host}/m/member/join/complete`
              })
              window.location.href = '/m'
            } else {
              window.location.href = '/m'
            }
          })
        } else {
          this.status = true
        }
      })
    }
  }
}
</script>
