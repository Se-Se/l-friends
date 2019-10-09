<template>
  <div>
    <sub-page-header title="공지사항"/>
    <div id="container">
      <div class="notice">
        <notice-container
          :notices="bbsList"
        />
      </div>
      <div class="notice-pagination">
        <pagination
          v-model="page"
          :total="bbsCount || 1"
          :limit="bbsPageSize"
          :scrollTop="true"
          @change="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import NoticeContainer from '../../service/NoticeContainer'
import Pagination from '@/components/mobile/common/list/Pagination'
import { Alert } from '@/utils/event-bus'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'BBSBoard',
  components: {
    SubPageHeader,
    NoticeContainer,
    Pagination
  },
  data () {
    return {
      page: 1
    }
  },
  methods: {
    ...mapActions('board', ['featchBBS']),
    pageChange () {
      this.featchBBS(this.page)
    },
    refresh () {
      this.page = 1
      this.featchBBS(this.page)
      Alert({
        message: '게시글 등록이 완료되었습니다.'
      })
    }
  },
  computed: {
    ...mapState('board', ['bbsCount', 'bbsList', 'bbsPageSize'])
  }
}
</script>

<style lang="scss" scoped>
.notice-pagination{
  margin: 2rem 0 8rem 0;
}
</style>
