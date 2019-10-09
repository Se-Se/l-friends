import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      userName: '테스트',
      basicCrumbs: '홈',
      activeCrumbs: '마이페이지'
    }
  },
  computed: {
    ...mapState('myorder', ['loading', 'totalCount', 'orders', 'selectTypeFlg']),
    ...mapGetters('common', ['productInquiryTypes'])
  }
}
