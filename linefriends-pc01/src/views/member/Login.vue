<template>
  <div id="container" class="login">
    <div class="wrap">
      <BreadCrumbs :breadCrumbs="'ログイン'"></BreadCrumbs>
      <!-- ↓↓↓↓↓ ログイン ↓↓↓↓↓ -->
      <div class="login-wrapper">
        <h2>ログイン</h2>
        <ul class="input_list">
          <li>
            <div class="input_text"><input type="text" v-model="login.email" placeholder="メールアドレスを入力してください" @input="emailInput($event.target.value)" /></div>
          </li>
          <li>
            <div class="input_text"><input type="password" v-model="login.password" placeholder="パスワードを入力してください" @keypress.enter="loginAction" /></div>
          </li>
        </ul>

        <div class="checkbox-layout">
          <div class="table-grid">
            <div class="table-grid__left">
              <span class="bx_input">
                <input id="input5" type="checkbox" v-model="saveId" />
                <label for="input5">次回よりユーザーIDの入力を省略する</label>
              </span>
            </div>
            <div class="table-grid__left">
              <span>
                <router-link to="/member/find/password">パスワードをお忘れですか？</router-link>
              </span>
            </div>
          </div>
        </div>

        <button class="btn btn_green mar-top-32" @click.prevent="loginAction">ログイン</button>
        <div class="sns-layout">
          <ul class="sns-login">
            <li @click.prevent="snsConnect('line')">
              <div class="line sns-login__action">LINEでログイン</div>
            </li>
            <li @click.prevent="snsConnect('facebook')">
              <div class="facebook sns-login__action">facebookでログイン</div>
            </li>
            <li @click.prevent="snsConnect('google')">
              <div class="google sns-login__action">googleでログイン</div>
            </li>
          </ul>
        </div>
        <p class="member-join">初めてですか？
          <router-link to="/member/join">
            新規会員登録
          </router-link>
        </p>
      </div>
      <!-- ↑↑↑↑↑ ログイン ↑↑↑↑↑ -->
    </div>

  </div>
</template>
<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'
import cookies from 'js-cookie'
import { Alert, Confirm } from '@/components/common/modal'
import { setCookie, removeCookie } from '@/utils/utils'
export default {
  data () {
    return {
      login: {
        email: '',
        password: ''
      },
      saveId: false,
      snsState: Math.floor(Math.random() * 10000)
    }
  },
  components: {
    BreadCrumbs
  },
  methods: {
    checkValidation () {
      if (this.login.email === '' || this.login.password === '') {
        Alert('ログイン情報を入力してください。')
        return false
      }
      return true
    },
    emailInput (value) {
      this.login.email = value.replace(/[^A-Za-z0-9~\-.!@#$%^&*()_+']/g, '')
    },
    async loginAction () {
      const error = this.checkValidation()
      if (!error) {
        return false
      }
      if (this.saveId === true) {
        setCookie('saveUserId', this.login.email, 60 * 60 * 24 * 30)
      } else {
        removeCookie('saveUserId')
      }

      // await this.$store.dispatch('cart/fetchCart')
      await this.$store.dispatch('authentication/normalLogin', {
        memberId: this.login.email,
        password: this.login.password
      }).then(async (response) => {
        if (response.status === 200) {
          await this.$store.dispatch('cart/mergeCart')
          if (this.$route.query.redirect) {
            location.href = this.$route.query.redirect
          } else {
            location.href = '/'
          }
        }
      }).catch(e => {
        if (e.data.code === 'M0019' || e.data.code === 'M1003') {
          Alert({
            title: 'ログイン',
            message: 'IDまたはパスワードが間違っているか、IDが登録されていません。<br/>(パスワードを10回間違えた場合、1分間ログインできなくなります)'
          })
        }
        if (e.data.code === 'M0005') {
          Confirm({
            message: 'メールアドレス確認が完了していません。再送が必要な場合は再送信ボタンを押してください。',
            confirm: '再送信'
          }).then(res => {
            if (res) {
              this.$store.dispatch('authentication/sendMailCode', {
                email: this.login.email,
                uri: `${location.protocol}//${location.host}/member/join/complete`
              })
            }
          })
        }
      })
    },
    snsConnect (sns) {
      let provider = ''
      switch (sns) {
        case 'line':
          provider = 'ncp_line'
          break
        case 'facebook':
          provider = 'ncp_facebook'
          break
        case 'google':
          provider = 'ncp_google'
          break
      }
      this.$store.dispatch('authentication/getSnsLoginUrl', {
        provider: provider,
        redirectUri: location.origin + '/member/login/callback/' + sns,
        state: this.snsState
      }).then((response) => {
        location.href = response.data.loginUrl
      })
    }
  },
  async mounted () {
    if (cookies.get('saveUserId')) {
      this.saveId = true
      this.login.email = cookies.get('saveUserId')
    }
    if (this.$route.params.sns) {
      let sns = this.$route.params.sns
      let provider = ''
      switch (sns) {
        case 'line':
          provider = 'ncp_line'
          break
        case 'facebook':
          provider = 'ncp_facebook'
          break
        case 'google':
          provider = 'ncp_google'
          break
      }
      this.$store.dispatch('authentication/getSnsAccessToken', {
        provider: provider,
        code: this.$route.query.code,
        redirectUri: location.origin + '/member/login/callback/' + sns,
        state: this.$route.query.state
      })
    }
  }
}

</script>
