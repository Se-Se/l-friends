<template>
  <main-wrapper>
    <div class="notice etc">
      <div class="mypage_inner">
        <h1>고객센터</h1>
        <div>
          <div class="mypage-menu">
            <ul class="mypage-menu__wrap">
              <li class="mypage-menu__item">
                <router-link to="/etc/faq">
                  <button
                    type="button"
                    class="etc-btn"
                  >FAQ</button>
                </router-link>
              </li>
              <li class="mypage-menu__item active">
                <router-link to="/notice/list">
                  <button
                    type="button"
                    class="etc-btn"
                  >공지사항</button>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="filter" style="margin-top: 35px;">
            <h2>공지사항</h2>
            <!-- <div class="btn_style_6">
              <button class="btn btn_gray" @click="openAddWindow">글쓰기</button>
            </div> -->
          </div>
          <div class="table_wrap">
            <table class="table_data td_1 bor-1 link">
              <colgroup>
                <col style="width: 420px">
                <col style="width: 100px">
                <col style="width: 100px">
              </colgroup>
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody v-if="bbsList.length > 0">
                <tr v-for="item in bbsList">
                  <td class="text_left_sp1 pointer_style">
                    <router-link :to="`/notice/detail/${item.articleNo}`">
                      <div class="bbs_title">
                        <p class="notice-max__title">{{ item.title }}</p>
                        <em v-if="item.repliedCnt > 0" style="color: red;">[{{item.repliedCnt}}]</em>
                      </div>
                    </router-link>
                  </td>
                  <td class="pointer_style">{{ $t('companyTitle') }}</td>
                  <td class="pointer_style"><span class="txt_color_gray num">{{ formatDate(item.registerYmdt) }}</span></td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="4">등록된 게시글이 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <BBSBoardAdd ref="pop" @refresh="refresh" :bbsDatail="null"></BBSBoardAdd>
          <pagination class="mt-3" v-model="page" :total="bbsCount || 1" :limit="bbsPageSize" @change="pageChange" ref="pagination" />
        </div>
      </div>
    </div>
  </main-wrapper>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Pagination from '@/components/pc/assets/Pagination'
import BBSBoardAdd from '@/components/pc/pages/notice/BBSBoardAdd'
import filters from '@/filters/index'
import MainWrapper from '@/components/pc/layout/common/MainWrapper'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  data () {
    return {
      page: 1
    }
  },
  components: {
    Pagination,
    BBSBoardAdd,
    MainWrapper
  },
  methods: {
    ...mapActions('board', ['featchBBS']),
    pageChange (page) {
      this.page = page
      this.featchBBS(page)
    },
    openAddWindow () {
      this.$refs.pop.isOpen = true
    },
    refresh () {
      this.page = 1
      this.featchBBS(this.page)
      // alert('게시글 등록이 완료되었습니다.')
      Alert({
        message: '게시글 등록이 완료되었습니다.'
      })
    },
    formatDate (dateStr) {
      return filters.dateFormatStr(dateStr, 'yyyy.MM.dd')
    }
  },
  computed: {
    ...mapState('board', ['bbsCount', 'bbsList', 'bbsPageSize'])
  }
}
</script>
<style lang="scss" scoped>
.notice-max__title {
  max-width: 650px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#wrap.pc #container.payco {
  padding-top: 161px;

  .pointer_style {
    cursor: default !important;
  }
  .bbs_title {
    width: 100%;
  }

  .bbs_title p {
    color: #3c3c3c;
    max-width: 540px;
    line-height: 79px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: normal;
    margin-right: -2px;
  }

  .bbs_title em {
    line-height: 79px;
    display: inline-block;
    vertical-align: middle;
  }

  @import '~@/styles/pc/payco/index.scss';
}
.text_left_sp1 {
  text-align: left !important;
}
</style>
