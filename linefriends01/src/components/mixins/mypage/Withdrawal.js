import { logoutRemoveCookie } from '@/utils/utils'
import { Alert } from '@/utils/event-bus'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      agree: false,
      opinion: ''
    }
  },
  computed: {
    ...mapState('common', ['malls'])
  },
  methods: {
    goProfile () {
      this.$router.push({ path: '/mypage/profile' })
    },
    submit () {
      if (!this.agree) {
        Alert({
          title: '알림',
          message: this.$t('mypage.withdrawal.error.agree')
        })
        return false
      }
      this.$store.dispatch('profile/delProfile', {
        reason: this.opinion
      }).then((response) => {
        // alert(this.malls.mall.mallName + this.$t('mypage.withdrawal.complete'))
        Alert({
          message: this.malls.mall.mallName + this.$t('mypage.withdrawal.complete')
        })
        logoutRemoveCookie()
        this.$router.push({ path: '/' })
      })
    }
  }
}
