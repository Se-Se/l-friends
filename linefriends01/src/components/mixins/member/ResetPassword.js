import cookies from 'js-cookie'

export default {
  data () {
    return {
      email: '',
      error: {}
    }
  },
  methods: {
    async validationCheck () {
      let errors = {}
      if (this.email.trim() === '') {
        errors.email = this.$t('member.resetPassword.error.empty')
        this.error = errors
        return false
      }

      let isEmail = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)$/.test(this.email)
      if (!isEmail) {
        errors.email = this.$t('member.resetPassword.error.email')
        this.error = errors
        return false
      }

      await this.$store.dispatch('member/emailExits', this.email).then((result) => {
        if (result.data.exist !== true) {
          errors.email = this.$t('member.resetPassword.error.exist')
          return false
        }
      })

      this.error = errors

      if (Object.keys(this.error).length > 0) {
        return false
      }

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
      }).catch((err) => {
        if (err.data.code === 'M0005') {
          this.error = {
            email: this.$t('member.resetPassword.error.certification')
          }
        }
      })
    }
  }
}
