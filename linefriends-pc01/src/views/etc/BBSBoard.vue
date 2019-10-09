<template>
  <!-- ↓↓↓↓↓ wrapper-pc ↓↓↓↓↓ -->
  <div class="wrapper-pc">
    <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
    <div id="container" class="cs">
      <!-- order detial -->
      <div class="wrap">
        <!-- ↓↓↓↓↓ mypage-content ↓↓↓↓↓ -->
        <div class="cs-content">
          <h1>サポート</h1>

          <customer-service-tab activeType="notice"/>

          <!-- ↓↓↓↓↓ notice_info ↓↓↓↓↓ -->
          <div class="notice_info ">
            <div class="table_wrap">
              <table class="table_data cursor_pointer">
                <colgroup>
                  <col />
                  <col style="width: 16%;" />
                  <col style="width: 17%;" />
                </colgroup>
                <thead>
                  <tr>
                    <th>タイトル</th>
                    <th>作成者</th>
                    <th>登録日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(notice,index) in bbsList" :key="index" @click="goNoticeDetail(notice.articleNo)">
                    <td>
                      <a href="#">{{ notice.title }}</a>
                    </td>
                    <td>LINE FRIENDS</td>
                    <td>{{notice.registerYmdt}}</td>
                  </tr>
                </tbody>
              </table>
              <pagination v-model="page" :total="bbsCount || 1" :limit="bbsPageSize" @change="pageChange" />
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
  <!-- ↑↑↑↑↑ wrapper-pc ↑↑↑↑↑ -->
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Pagination from '@/components/common/Pagination'
import CustomerServiceTab from '@/components/etc/CustomerServiceTab'
export default {
  components: {
    Pagination,
    CustomerServiceTab
  },
  data () {
    return {
      page: 1,
      redirect: `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
    }
  },
  computed: {
    ...mapState('board', ['bbsCount', 'bbsList', 'bbsPageSize'])
  },
  methods: {
    ...mapActions('board', ['featchBBS']),
    pageChange () {
      this.featchBBS(this.page)
    },
    goNoticeDetail (articleNo) {
      this.$router.push({
        path: `/notice/detail/${articleNo}`
      })
    }
  }
}
</script>
