import { Alert } from '@/utils/event-bus'
import { joinPasswordValidation } from '@/utils/validateUtils'
import cookies from 'js-cookie'

export default {
  data () {
    return {
      oldPassword: '',
      password: '',
      passwordConfirm: '',
      error: {}
    }
  },
  methods: {
    editPasswordAction () {
      this.validationCheck().then((res) => {
        if (res === false) return false
        // // 기존 비밀번호 인력안해도 수정가능 ...;
        // this.$store.dispatch('profile/checkPassword', this.oldPassword).then((response) => {
        // })updatePassword
        this.$store.dispatch('profile/updatePassword', {
          currentPassword: this.oldPassword,
          newPassword: this.password
        }).then((response) => {
          // this.$router.push({ path: '/' })
          // alert('비밀번호가 변경되었습니다. 재로그인 해주시기 바랍니다.')
          Alert({
            message: '비밀번호가 변경되었습니다. 재로그인 해주시기 바랍니다.'
          })
          this.$store.dispatch('authentication/logoutToLogin')
        })
      })
    },
    async validationCheck () {
      this.error = {}
      if (this.oldPassword.length === 0) {
        this.error = {
          ...this.error,
          oldPassword: this.$t('mypage.profile.error.passwordNull')
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
      if (Object.keys(this.error).length > 0) {
        return false
      }
    }
  },
  mounted () {
    cookies.remove('authProfile')
  }
}
