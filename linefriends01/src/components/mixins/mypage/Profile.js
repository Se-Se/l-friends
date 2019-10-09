import { mapState, mapGetters } from 'vuex'
import cookies from 'js-cookie'
import filters from '@/filters/index'
import { isPC } from '@/utils/utils'
import { Alert } from '@/utils/event-bus'

export default {
  data () {
    return {
      error: '',
      notify: {
        email: false // directMailAgreed
      },
      snsState: Math.floor(Math.random() * 10000),
      name: ''
    }
  },
  computed: {
    ...mapState('profile', ['profile']),
    ...mapGetters('profile', ['memberId', 'memberName', 'getConnectSns']),
    memberGradeName () {
      return cookies.get('memberGradeName')
    },
    memberGroupNames () {
      return cookies.get('memberGroupNames')
    }
  },
  methods: {
    setName (value) {
      this.$nextTick(() => {
        this.name = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9~!@#$%^&*()_+']/g, '')
      })
    },
    editProfile () {
      if (this.notify.email === true) {
        // alert(this.$t('mypage.profile.notice.agree.true') + ' (' + filters.dateFormat(new Date(), 'yyyy.MM.dd HH:mm:ss') + ')')
        Alert({
          message: this.$t('mypage.profile.notice.agree.true') + ' (' + filters.dateFormat(new Date(), 'yyyy.MM.dd HH:mm:ss') + ')'
        })
      } else {
        // alert(this.$t('mypage.profile.notice.agree.false') + ' (' + filters.dateFormat(new Date(), 'yyyy.MM.dd HH:mm:ss') + ')')
        Alert({
          message: this.$t('mypage.profile.notice.agree.false') + ' (' + filters.dateFormat(new Date(), 'yyyy.MM.dd HH:mm:ss') + ')'
        })
      }
      this.$store.dispatch('profile/updateProfile', { memberName: this.name, directMailAgreed: this.notify.email }).then((result) => {
        this.$router.push({
          'path': isPC() ? '/mypage/orderlist' : '/mypage'
        })
      })
    },
    snsConnect (sns) {
      let provider = ''
      if (this.getConnectSns[sns] === 'ing') {
        switch (sns) {
          case 'naver':
            provider = 'naver'
            break
          case 'line':
            provider = 'line'
            break
          case 'facebook':
            provider = 'facebook'
            break
        }
        this.$store.dispatch('authentication/_unlinkOpenId', {
          params: { providerType: provider }
        }).then((response) => {
          this.$store.dispatch('profile/memberFetch')
        })
      } else {
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
          redirectUri: location.origin + '/mypage/profile/callback/' + sns,
          state: this.snsState
        }).then((response) => {
          location.href = response.data.loginUrl
        })
      }
    }
  },
  async mounted () {
    this.name = this.memberName
    if (this.profile.directMailAgreed) {
      this.notify.email = this.profile.directMailAgreed
    }
    if (this.$route.params.sns) {
      cookies.set('authProfile', true)
      let sns = this.$route.params.sns
      let type = 'connect'
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
        type: type,
        provider: provider,
        code: this.$route.query.code,
        redirectUri: location.origin + '/mypage/profile/callback/' + sns,
        state: this.$route.query.state
      })
    }
  }
}
