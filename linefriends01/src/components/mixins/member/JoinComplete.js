import cookies from 'js-cookie'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  data () {
    return {
      status: false,
      basicCrumbs: this.$t('page.home'),
      activeCrumbs: this.$t('page.member.complate'),
      form: {
        home: {
          action: 'button',
          to: '',
          title: this.$t('button.goHome'),
          type: 'long'
        }
      }
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
            title: '알림',
            message: '유효하지 않은 인증 메일입니다.</br> 인증 메일 재발송 버튼을 눌러주세요.',
            buttons: {
              confirm: '재발송'
            },
            cancelRedirect: '/',
            callback () {
              this.$store.dispatch('authentication/sendMailCode', {
                email: email,
                uri: `${location.protocol}//${location.host}/member/join/complate`
              })
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
