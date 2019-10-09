import cookies from 'js-cookie'
import { joinPasswordValidation, changeKoreanToEmptyString } from '@/utils/validateUtils'

export default {
  data () {
    return {
      email: '',
      password: null,
      passwordConfirm: null,
      marketing: false,
      error: {},
      basicCrumbs: this.$t('page.home'),
      activeCrumbs: this.$t('page.member.join'),
      input: {
        email: {
          model: '',
          title: this.$t('member.join.title.email'),
          type: 'text',
          placeholder: this.$t('member.join.placeholder.email'),
          interval: false,
          reChk: true,
          value: ''
        },
        password: {
          model: '',
          title: this.$t('member.join.title.password'),
          type: 'password',
          placeholder: this.$t('member.join.placeholder.password'),
          interval: false,
          reChk: true,
          max: 20
        },
        passwordRechk: {
          model: '',
          title: this.$t('member.join.title.passwordConfirm'),
          type: 'password',
          placeholder: this.$t('member.join.placeholder.passwordConfirm'),
          interval: false,
          reChk: true,
          max: 20
        }
      },
      form: {
        join: {
          action: 'button',
          to: '',
          title: this.$t('button.next'),
          type: 'long'
        }
      },
      layerPopup: {
        'status': false,
        'title': '회원가입',
        'text': ''
      }
    }
  },
  methods: {
    async signUp () {
      await this.validationCheck()
      if (Object.keys(this.error).length > 0) {
        return false
      }
      if (
        this.$refs.agree &&
        (
          this.$refs.agree.agree.service === false ||
          this.$refs.agree.agree.privercy === false ||
          this.$refs.agree.agree.age === false
        )
      ) {
        return false
      }
      this.$store.dispatch('profile/signUp', {
        email: this.email,
        memberId: this.email,
        password: this.password,
        directMailAgreed: this.marketing
      }).then(async (response) => {
        cookies.remove('joinType')
        cookies.remove('mailJoin')
        cookies.remove('normalJoin')
        this.$store.dispatch('authentication/sendMailCode', {
          email: this.email,
          uri: `${location.protocol}//${location.host}/member/join/complate`
        }).then((response) => {
          cookies.set('authJoin', this.email)
          this.$router.push({
            path: '/member/join/sendEmail',
            query: {
              email: this.email
            }
          })
        })
      })
    },
    async validationCheck () {
      if (this.email.trim() === '') {
        this.error = {
          email: this.$t('member.join.error.empty')
        }
        return false
      }
      const isEmail = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)$/.test(this.email)
      if (!isEmail) {
        this.error = {
          email: this.$t('member.join.error.email')
        }
        return false
      }
      await this.$store.dispatch('member/emailExits', this.email).then((result) => {
        if (result.data.exist === true) {
          if (result.data.needAuthority === true) {
            this.error = {
              email: this.$t('member.join.error.certification')
            }
          } else {
            this.error = {
              email: this.$t('member.join.error.exist')
            }
          }
          return false
        }

        if (!this.password) {
          this.error = {
            password: this.$t('member.join.error.passwordNull')
          }
          return false
        }

        if (this.password.length < 8) {
          this.error = {
            password: this.$t('member.join.error.passwordInconformity')
          }
          return false
        }

        if (this.password.length > 20) {
          this.error = {
            password: this.$t('member.join.error.passwordInconformity2')
          }
          return false
        }
        const validationResult = joinPasswordValidation(this.password)
        if (!validationResult.code) {
          this.error = {
            password: validationResult.pattern + this.$t('member.join.error.passwordInconformity3')
          }
          return false
        }
        if (!this.passwordConfirm) {
          this.error = {
            passwordConfirm: this.$t('member.join.error.passwordConfirmNull')
          }
          return false
        }

        if (this.password !== this.passwordConfirm) {
          this.error = {
            passwordConfirm: this.$t('member.join.error.passwordConfirm')
          }
          return false
        }
        this.error = {} // reset
      })
    }
  }
}
