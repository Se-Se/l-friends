<template>
  <div id="container" class="login">
    <div class="wrap" v-if="status">
      <bread-crumbs breadCrumbs="会員登録完了"/>
      <div class="register-success">
        <h2>会員登録完了</h2>
        <dl class="success-mail">
          <dt>{{memberId}}<p class="respecttxt">様、</p></dt>
          <dd>ご登録いただき<br>ありがとうございます。 </dd>
        </dl>
        <button class="btn btn_green" @click="goHome">トップページへ</button>
      </div>
    </div>
  </div>
</template>
<script>
import { Confirm } from '@/components/common/modal'
import BreadCrumbs from '@/components/common/BreadCrumbs'
export default {
  name: 'JoinComplete',
  components: {
    BreadCrumbs
  },
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
      this.$router.replace({ path: '/' })
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
                uri: `${location.protocol}//${location.host}/member/join/complete`
              })
              window.location.href = '/'
            } else {
              window.location.href = '/'
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
