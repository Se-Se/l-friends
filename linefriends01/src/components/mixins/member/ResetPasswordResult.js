import { joinPasswordValidation, changeKoreanToEmptyString } from '@/utils/validateUtils'

export default {
  data () {
    return {
      password: '',
      passwordConfirm: '',
      error: {}
    }
  },
  methods: {
    editPasswordAction () {
      this.validationCheck().then(() => {
        if (Object.keys(this.error).length > 0) {
          return false
        }
        this.$store.dispatch('profile/certificatedByEmail', {
          certificationNumber: this.$route.query.cn,
          memberId: this.$route.query.email,
          newPassword: this.password
        }).then((response) => {
          this.$router.push({path: '/member/find/password/success'})
        })
      })
    },
    async validationCheck () {
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
      this.error = {}
    }
  },
  mounted () {
    if (this.$route.query.cn) {
      this.$store.dispatch('authentication/passwordMailCode', {
        email: this.$route.query.email,
        cn: this.$route.query.cn
      }).then((response) => {
        console.log(response)
      })
    }
  }
}
