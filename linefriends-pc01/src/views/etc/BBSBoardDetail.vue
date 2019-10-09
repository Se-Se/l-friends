<template>
  <div class="wrapper-pc">
    <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
    <div id="container" class="cs">
      <!-- ↓↓↓↓↓ wrap ↓↓↓↓↓ -->
      <div class="wrap">
        <!-- ↓↓↓↓↓ mypage-content ↓↓↓↓↓ -->
        <div class="cs-content">
          <h1>サポート</h1>

          <customer-service-tab activeType="notice" />

          <!-- ↓↓↓↓↓ notice_info ↓↓↓↓↓ -->
          <div class="notice_info">
            <div class="notice_detail" v-if="bbsDatail">
              <div class="go_list">
                <button class="btn btn_primary size_m" @click="moveToList">リスト</button>
              </div>
              <div class="detail_head">
                <h3>{{bbsDatail.title}}</h3>
                <p class="data">{{bbsDatail.registerYmdt}}</p>
              </div>
              <div class="detail_info">
                <p class="author">LINE FRIENDS</p>
                <p class="read_num">閲覧数 {{bbsDatail.viewCnt}}</p>
              </div>
              <div class="detail_body" v-html="_xssFilter(bbsDatail.content)" />
            </div>
          </div>
          <!-- ↑↑↑↑↑ notice_info ↑↑↑↑↑ -->
        </div>
        <!-- ↑↑↑↑↑ mypage-content ↑↑↑↑↑ -->
      </div>
      <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
import CustomerServiceTab from '@/components/etc/CustomerServiceTab'
import { xssFilter } from '@/utils/utils'
export default {
  name: 'NoticeDetail',
  components: {
    // SubHeader
    CustomerServiceTab
  },
  computed: {
    ...mapState('board', ['bbsDatail'])
  },
  data () {
    return {
      from: null,
      title: 'サポート'
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => { vm.from = from })
  },
  methods: {
    _xssFilter (str) {
      return xssFilter(str)
    },
    moveToList () {
      if (this.from && this.from.name === 'BBSBoard') {
        this.$router.go(-1)
      } else {
        this.$router.push({
          name: 'BBSBoard'
        })
      }
    }
  }
}
</script>
