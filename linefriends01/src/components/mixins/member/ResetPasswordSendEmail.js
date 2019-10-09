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
      let isEmail = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(this.email)
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
      this.$router.push({ path: '/member/find/password/email' })
    }
  }
}
