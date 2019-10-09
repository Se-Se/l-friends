import cookies from 'js-cookie'
import router from '@/router'
import {
  Alert,
  Confirm
} from '@/utils/event-bus'
import {
  PasswordValidation
} from '@/utils/validateUtils'

export default {
  data () {
    return {
      basicCrumbs: '홈',
      activeCrumbs: '로그인',
      id: '',
      password: '',
      login: {
        email: {
          type: 'text',
          placeholder: this.$t('member.login.placeholder.email'),
          interval: false,
          value: ''
        },
        password: {
          type: 'password',
          placeholder: this.$t('member.login.placeholder.password'),
          interval: false,
          value: '',
          max: 20
        }
      },
      form: {
        login: {
          action: 'button',
          to: '',
          title: '로그인',
          type: 'long'
        }
      },
      saveId: false,
      snsState: Math.floor(Math.random() * 10000)
    }
  },
  methods: {
    checkValidation () {
      if (this.login.email.value === '' || this.login.password.value === '') {
        return this.$t('member.login.validation.nullAble')
      }
      // 20190702 삭제요청
      /*
      if (!PasswordValidation(this.login.password.value)) {
        return this.$t('member.login.validation.nullAble')
      }
      */
    },
    async loginAction () {
      const error = this.checkValidation()
      if (error) {
        Alert({
          // title: '로그인',
          message: error
        })
        return false
      }
      if (this.saveId === true) {
        cookies.set('saveUserId', this.login.email.value)
      } else {
        cookies.remove('saveUserId')
      }
      let userEmail = this.login.email.value

      await this.$store.dispatch('cart/fetchCart')
      await this.$store.dispatch('authentication/normalLogin', {
        memberId: this.login.email.value,
        password: this.login.password.value
      }).then(async (response) => {
        if (response === 'M0005') {
          Confirm({
            // title: '알림',
            message: '메일 인증이 완료되지 않았습니다.</br> 메일 재발송을 원하시면 재발송 버튼을 눌러주세요.',
            buttons: {
              confirm: '재발송'
            },
            callback () {
              this.$store.dispatch('authentication/sendMailCode', {
                email: userEmail,
                uri: `${location.protocol}//${location.host}/member/join/complate`
              })
            }
          })
        }
        if (response.status === 200) {
          await this.$store.dispatch('cart/mergeCart')
          if (this.$route.query.redirect) {
            location.href = this.$route.query.redirect
          } else {
            location.href = '/'
          }
        }
      })
    },
    snsConnect (sns) {
      console.log(sns)
      let provider = ''
      switch (sns) {
        case 'naver':
          provider = 'ncp_naver'
          break
        case 'line':
          provider = 'ncp_line'
          break
        case 'facebook':
          provider = 'ncp_facebook'
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
      this.login.email.value = cookies.get('saveUserId')
    }
    if (this.$route.params.sns && !this.$route.query.error) {
      let sns = this.$route.params.sns
      let provider = ''
      switch (sns) {
        case 'naver':
          provider = 'ncp_naver'
          break
        case 'line':
          provider = 'ncp_line'
          break
        case 'facebook':
          provider = 'ncp_facebook'
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
