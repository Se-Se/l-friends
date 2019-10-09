import { mapState, mapGetters } from 'vuex'
import cookies from 'js-cookie'

export default {
  props: {
    name: {
      type: String,
      required: false
    },
    executives: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    ...mapState('member', ['mySummary', 'welfareTotal']),
    ...mapState('myorder', ['pointName']),
    ...mapGetters('profile', ['memberId', 'memberName', 'getConnectSns', 'isExec']),
    memberGradeName () {
      return cookies.get('memberGradeName')
    },
    memberGroupNames () {
      return cookies.get('memberGroupNames')
    },
    point () {
      return this.profile.point.toLocaleString()
    }
  }
}
