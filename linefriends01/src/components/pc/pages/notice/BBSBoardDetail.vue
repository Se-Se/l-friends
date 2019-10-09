<template>
<main-wrapper>
  <layout-width>
    <div class="notice">
      <div id="container" class="notice-detail">
        <div class="community_inner" v-if="bbsDatail">
          <h1 class="lst_tab_tit">
            공지사항
              <button type="button" class="white-button review btn_list" @click="moveList">
                <span class="txt">목록</span>
              </button>
          </h1>
          <div class="community_con">
            <div class="head">
              <div class="title">
                <!-- <span class="cation">[{{ bbsDatail.categoryLabel }}]</span> -->
                <span class="name">{{ bbsDatail.title }}</span>
              </div>
              <div class="info">
                <span class="date">{{ formatDate(bbsDatail.registerYmdt) }}</span>
                <span class="tool" v-if="bbsEditAble">
                  <a href="javascript: void(0)" @click.prevent="modify">수정</a> | <a href="javascript: void(0)" @click.prevent="del">삭제</a>
                </span>
              </div>
            </div>
            <div class="member">
              <span>{{ $t('companyTitle') }}</span><span>{{ bbsDatail.registerGroupNames }}</span>
              <span class="viewCnt">조회수 <em>{{ bbsDatail.viewCnt}}</em></span>
            </div>
            <div class="details">
              <viewer :value="bbsDatail.content"/>
            </div>
            <!-- <div class="community_comments" v-if="false">
              <BBSBoardComment v-for="item in bbsDatail.childArticles" :item="item" :key="item.articleNo"></BBSBoardComment>
              <div class="comments_list">
                <div class="list_head">
                  <span class="info">{{ profile.memberName }} | {{ profile.memberGroupNames }}</span>
                </div>
                <div class="area_qna_form">
                  <form>
                    <fieldset>
                      <legend class="blind">상품문의 등록하기</legend>
                      <div class="bx_write">
                        <textarea placeholder="" maxlength="1000" v-model="content"></textarea>
                        <span class="text_count"><span class="num">{{contentWords}}</span>/1,000</span>
                      </div>
                      <div class="qna_bottom">
                        <button type="button" class="btn regist" v-not-double-click @click="submit">댓글입력</button>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div> -->
            <!-- <div class="foot_info"><button type="button" class="white-button review btn_list" @click="moveList"><span class="txt">목록</span></button></div> -->
          </div>
        </div>
      </div>
    </div>
  </layout-width>
</main-wrapper>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import filters from '@/filters/index'
import BBSBoardAdd from '@/components/pc/pages/notice/BBSBoardAdd'
import BBSBoardComment from '@/components/pc/pages/notice/BBSBoardComment'
import Viewer from '@toast-ui/vue-editor/src/Viewer.vue'
import MainWrapper from '@/components/pc/layout/common/MainWrapper'
import LayoutWidth from '@/components/pc/layout/common/LayoutWidth'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  data () {
    return {
      content: ''
    }
  },
  components: {
    BBSBoardAdd,
    BBSBoardComment,
    Viewer,
    MainWrapper,
    LayoutWidth
  },
  methods: {
    ...mapActions('board', ['commitBBS', 'fetchBBSDetail', 'bbsDelete']),
    formatDate (dateStr) {
      return filters.dateFormatStr(dateStr, 'yyyy.MM.dd HH:mm')
    },
    submit () {
      let content = this.content
      if (content.trim() === '') {
        // alert('댓글을 입력해 주세요.')
        Alert({
          message: '댓글을 입력해 주세요.'
        })
        return false
      }
      this.commitBBS({
        articleNo: 0,
        articleTitle: this.bbsDatail.title + '의 댓글',
        articleContent: content,
        parentBoardArticleNo: this.bbsDatail.articleNo,
        boardCategoryNo: this.bbsDatail.categoryNo
      }).then((data) => {
        this.fetchBBSDetail(this.bbsDatail.articleNo)
        // alert('등록이 완료되었습니다.')
        Alert({
          message: '등록이 완료되었습니다.'
        })
        this.content = ''
      })
    },
    modify () {
      this.$refs.pop.isOpen = true
    },
    del () {
      // if (confirm('삭제하시겠습니까?')) {
      //   this.bbsDelete(this.bbsDatail.articleNo).then((data) => {
      //     this.$router.replace('/BBSBoard')
      //   })
      // }
      Confirm({
        message: '삭제하시겠습니까?',
        callback: () => {
          this.bbsDelete(this.bbsDatail.articleNo).then((data) => {
            this.$router.replace('/BBSBoard')
          })
        }
      })
    },
    refresh () {
      this.fetchBBSDetail(this.bbsDatail.articleNo)
      // alert('수정이 완료되었습니다.')
      Alert({
        message: '수정이 완료되었습니다.'
      })
    },
    moveList () {
      this.$router.push('/notice/list')
    }
  },
  computed: {
    ...mapState('board', ['bbsDatail', 'bbsEditAble', 'bbs404']),
    // ...mapState('profile', ['profile']),
    contentWords () {
      return this.content.length
    }
  }
}
</script>

<style lang="scss" scoped>
.viewCnt {
  position: absolute;
  right: 15px;
}
</style>
