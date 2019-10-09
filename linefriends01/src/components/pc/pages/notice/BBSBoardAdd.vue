<template>
  <ModalLayerPopup :visible.sync="isOpen" layer_class="layer_qna_report" popup_size_class="roller_area popup_size_10" @close="close">
    <div class="popup_wrap">
      <div class="popup_common roller_area popup_size_10">
        <h1>글쓰기</h1>
        <div class="con">
          <table class="table_info sp_2">
            <tbody>
              <tr>
                <th><span class="must">분류</span></th>
                <td>
                  <div>
                    <div class="bx_select width-270" style="z-index: 101" v-click-outside="backgroundClick">
                      <span class="blind">문의유형 선택</span>
                      <a href="#" class="txt_select" :class="{ 'on': selectOn}" @click.prevent.stop="selectBoxClick">
                        <template v-if="selectOn">{{ categoryPlaceHolder }}</template>
                        <template v-else>{{ categoryName || categoryPlaceHolder }}</template>

                        <span class="sp ico_arrow" @click.prevent.stop="selectOn = !selectOn">목록 열기</span>
                      </a>
                      <ul class="lst_select_content">
                        <li v-for="item in bbsCategorys" :key="item.categoryNo">
                          <a href="#" @click.prevent="selectItem(item)">{{ item.label }}</a>
                        </li>
                      </ul>
                    </div>
                    <div v-if="selectOn" class="background" @click="backgroundClick" />
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  <span class="must">제목</span>
                </th>
                <td><input type="text" maxlength="200" title="문의제목 입력" v-model="article.articleTitle"></td>
              </tr>
              <tr>
                <th>
                  <span class="must">내용</span>
                </th>
                <td>
                  <div class="textarea_evaluate">
                    <editor v-model="article.articleContent" ref="tuiEditor" :value="article.articleContent" :options="editorOptions" :visible="editorVisible" previewStyle="vertical" height="300px" mode="wysiwyg" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <ul class="btn_list">
            <li>
              <button class="btn btn_white" @click="close">취소</button>
            </li>
            <li>
              <button class="btn btn_gray" v-not-double-click @click.prevent="submit" v-if="this.bbsDatail === null">등록</button>
              <button class="btn btn_gray" v-not-double-click @click.prevent="submit" v-else>저장</button>
            </li>
          </ul>
        </div>
        <button class="btn_close" @click="close">close</button>
      </div>
    </div>
  </ModalLayerPopup>
</template>
<style scoped>
#container.mypage .popup_common h1 {
  text-align: left;
}
.layer_popup .popup_common .btn_close {
  top: 40px;
  right: 40px;
}
#container.mypage .popup_common .table_info.sp_2 th {
  height: 72px;
  width: 132px;
}
#container.mypage .popup_common .table_info.sp_2 td {
  border-bottom: none;
  padding-left: 20px;
}
#container.mypage .popup_common .check_list_1 {
  margin: 0;
}
#container.mypage .popup_common .check_list_1 ul li {
  display: list-item;
  margin-right: 0;
  width: auto;
}
</style>

<script>
import { mapState, mapActions } from 'vuex'
import ModalLayerPopup from '@/components/pc/popup/ModalLayerPopupNew'
import { Editor } from '@toast-ui/vue-editor'
import ClickOutside from 'vue-click-outside'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  props: ['bbsDatail'],
  components: {
    ModalLayerPopup,
    'editor': Editor
  },
  directives: {
    ClickOutside
  },
  data () {
    return {
      isOpen: false,
      selectOn: false,
      categoryPlaceHolder: '선택해주세요',
      categoryName: (this.bbsDatail === null) ? '' : this.bbsDatail.categoryLabel,
      article: {
        articleNo: (this.bbsDatail === null) ? 0 : this.bbsDatail.articleNo,
        articleTitle: (this.bbsDatail === null) ? '' : this.bbsDatail.title,
        articleContent: (this.bbsDatail === null) ? '' : this.bbsDatail.content,
        boardCategoryNo: (this.bbsDatail === null) ? '' : this.bbsDatail.categoryNo,
        parentBoardArticleNo: 0
      },
      editorText: '',
      editorOptions: {
        hideModeSwitch: true,
        hooks: {
          addImageBlobHook: (blob, callback) => {
            const imageSize = blob.size / (1024 * 1024)
            if (imageSize - 10 >= 0) {
              // alert('이미지 등록 실패 하였습니다.\n최대 10MB까지 등록가능합니다.')
              Alert({
                message: '이미지 등록 실패 하였습니다.\n최대 10MB까지 등록가능합니다.'
              })
            } else {
              this.imageuploading = true
              const data = new FormData()
              data.append('file', blob)
              this.uploadImages(data).then((res) => {
                callback(res.data.imageUrl, res.data.originName)
                this.imageuploading = false
              }).catch(() => {
                this.imageuploading = false
                // alert('이미지 등록 실패 하였습니다.\n최대 10MB까지 등록가능합니다.')
                Alert({
                  message: '이미지 등록 실패 하였습니다.\n최대 10MB까지 등록가능합니다.'
                })
              })
            }
          }
        }
      },
      editorHtml: '',
      editorVisible: true,
      imageuploading: false
    }
  },
  computed: {
    ...mapState('board', ['bbsCategorys'])
  },
  methods: {
    ...mapActions('board', ['commitBBS']),
    ...mapActions('common', ['uploadImages']),
    close () {
      this.isOpen = false
      this.selectOn = false
      this.categoryName = (this.bbsDatail === null) ? '' : this.bbsDatail.categoryLabel
      this.article = {
        articleNo: (this.bbsDatail === null) ? 0 : this.bbsDatail.articleNo,
        articleTitle: (this.bbsDatail === null) ? '' : this.bbsDatail.title,
        articleContent: (this.bbsDatail === null) ? '' : this.bbsDatail.content,
        boardCategoryNo: (this.bbsDatail === null) ? 0 : this.bbsDatail.categoryNo,
        parentBoardArticleNo: 0
      }
    },
    submit () {
      if (this.imageuploading) return false
      if (this.article.boardCategoryNo === 0) {
        // alert('분류를 선택해주세요.')
        Alert({
          message: '분류를 선택해주세요.'
        })
        return false
      }
      if (this.article.articleTitle.trim() === '') {
        // alert('제목을 입력해주세요.')
        Alert({
          message: '제목을 입력해주세요.'
        })
        return false
      }
      if (this.article.articleContent.trim() === '') {
        // alert('내용을 입력해주세요.')
        Alert({
          message: '내용을 입력해주세요.'
        })
        return false
      }
      this.article.articleContent = this.$refs.tuiEditor.invoke('getHtml')
      this.commitBBS(this.article).then((data) => {
        this.$emit('refresh')
      })
      this.close()
    },
    backgroundClick () {
      this.selectOn = false
    },
    selectBoxClick () {
      this.selectOn = true
    },
    selectItem (item) {
      this.article.boardCategoryNo = item.categoryNo
      this.categoryName = item.label
      this.selectOn = false
    }
  }
}
</script>