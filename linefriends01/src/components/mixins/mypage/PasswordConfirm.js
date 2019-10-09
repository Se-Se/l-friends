import { mapState, mapGetters } from 'vuex'
import cookies from 'js-cookie'
import { Alert } from '@/utils/event-bus'

export default {
  computed: {
    ...mapGetters('profile', ['memberId'])
  },
  methods: {
    async authProfile (password) {
      this.$store.dispatch('profile/checkPassword', password).then((response) => {
        cookies.set('authProfile', true)
        this.$router.push({ path: '/mypage/profile' })
      }).catch(() => {
        Alert({
          title: this.$t('alert.title.default'),
          message: this.$t('member.passwordConfirm.error.password')
        })
      })
    },
    goHome () {
      this.$router.push({ path: '/mypage/orderlist' })
    }
  }
}
