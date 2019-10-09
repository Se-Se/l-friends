<template>
  <div class="old-css">
    <div class="popup_wrap">
      <div class="popup_common popup_size_8">
        <header class="layer-popup__header">
          <h2 class="layer-popup__header--title">
            입점/제휴 문의
          </h2>
          <button
            type="button"
            class="layer-popup__header--btn"
            @click="cancel"
          >
            {{ $t('mypage.inquiry.close') }}
          </button>
        </header>
        <div class="con">
          <table class="table_info sp_2">
            <tbody>
              <tr>
                <th>
                  <span class="must">문의제목</span>
                </th>
                <td>
                  <div class="default-input">
                    <input type="text" maxlength="200" v-model="title">
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  <span class="must">문의내용</span>
                </th>
                <td>
                  <div class="textarea_evaluate">
                    <textarea
                      :placeholder="$t('mypage.productinquiry.placeholder.pc.content')"
                      class="default-textarea"
                      maxlength="2000"
                      v-model="content"></textarea>
                  </div>
                </td>
              </tr>
              <tr>
                <th>첨부</th>
                <td>
                  <div class="btn_file">
                    <input type="file" id="fileElem" class="fileElem" name="fileElem" multiple ref="inputFile" accept="image/*" @change="onFileChange">
                    <label class="btn btn_gray2" for="fileElem" @click="addImage">파일선택</label>
                  </div>
                  <div class="file_list">
                    <ul>
                      <template v-for="(image, index) in images">
                        <li :key="index">
                          <!-- <a>
                              <img :src="image.filedata" alt="" @load="imageShowLoaded">
                          </a> -->
                          <span>{{image.file.name}}</span>
                          <button class="btn_del" @click="removeImage(index)"></button>
                        </li>
                      </template>
                    </ul>
                  </div>
                  <div class="tip_1 sp_1">
                    <span class="txt_color_blue">5MB 미만의 JPG, PNG 파일만 등록 가능합니다.</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  <span class="must">정보입력</span>
                </th>
                <td>
                  <div class="per_info">
                    <ul>
                      <li>
                        <span>이메일</span>
                        <span class="default-input">
                          <input type="text" v-model="email">
                        </span>
                      </li>
                      <li>
                        <span>휴대전화</span>
                        <span class="default-input">
                          <input type="text" v-model="mobile" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
                        </span>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="agree">
            <span class="bx_input">
              <switch-item
                type="checkbox"
                :id="collection"
                :checked="collection"
                @change="check"
                label="개인정보 수집 이용 동의(필수)"
                title="개인정보 수집 이용 동의(필수)"
              />
            </span>
          </div>
          <div class="agree_list">
            <ul class="list_det">
              <li>1. 개인정보 수집 목적: 입점 제휴 문의 등록/확인</li>
              <li>2. 개인정보 수집 항목: [필수]문의자 이메일, 휴대폰번호,문의내용 [선택]첨부파일</li>
              <li style="font-weight: bold; font-size: 17px;">3. 개인정보 보유기간: 관련법령에 따라 3년간 보관</li>
              <li>입점/제휴 문의를 위한 필요최소한의 개인정보이며, 동의를 해주셔야 해당 서비스를 이용하실 수 있습니다.</li>
            </ul>
          </div>
          <ul class="btn_list">
            <li>
              <button class="btn btn_white" @click="cancel">취소</button>
            </li>
            <li>
              <button class="btn btn_gray" @click="submit">문의</button>
            </li>
          </ul>
        </div>
        <button class="btn_close" @click="cancel">close</button>
      </div>
    </div>
  </div>
</template>
<script>
import cookies from 'js-cookie'
import SwitchItem from '@/components/pc/assets/Switch'
import { checkPhone, checkMail } from '@/utils/validateUtils'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  components: {
    SwitchItem
  },
  data () {
    return {
      title: '',
      content: '',
      images: [],
      email: '',
      mobile: '',
      collection: false
    }
  },
  mounted () {
    if (window.history && window.history.pushState) {
      window.addEventListener('popstate', () => {
        this.$emit('closePop')
      }, false)
    }
  },
  methods: {
    submit () {
      if (this.title === '') {
        // alert('문의제목을 입력 해 주세요.')
        Alert({
          message: '문의제목을 입력 해 주세요.'
        })
        return
      }
      if (this.content === '') {
        // alert('문의내용을 입력 해 주세요.')
        Alert({
          message: '문의내용을 입력 해 주세요.'
        })
        return
      }
      if (checkMail(this.email)) {
        // alert(checkMail(this.email))
        Alert({
          message: checkMail(this.email)
        })
        return
      }
      if (checkPhone(this.mobile)) {
        // alert(checkPhone(this.mobile))
        Alert({
          message: checkPhone(this.mobile)
        })
        return
      }
      if (!this.collection) {
        // alert('개인정보 수집동의에 체크를 해주세요.')
        Alert({
          message: '개인정보 수집동의에 체크를 해주세요.'
        })
        return
      }
      let accessToken = cookies.get('ncpAccessToken')
      const paramsConnect = {
        articleTitle: this.title,
        articleContent: this.content + '<p>' + this.email + '&nbsp;' + this.mobile + '</p>'
      }
      if (accessToken === undefined) {
        paramsConnect.secreted = false
        paramsConnect.password = 'nhn!@#123'
      }
      const dispatch = this.$store.dispatch
      Promise.all(this.images.map(image => {
        if (image.file !== undefined) {
          const data = new FormData()
          data.append('file', image.file)
          return dispatch('common/uploadImages', data)
        }
      })).then(res => {
        paramsConnect.images = []
        if (res) {
          res.forEach(img => {
            const temp = {}
            temp.originalFileName = img.data.originName
            temp.uploadedFileName = img.data.imageUrl
            paramsConnect.images.push(temp)
          })
        }
        dispatch('board/addBoard', { paramsConnect }).then(() => {
          // alert('등록에 성공하였습니다. 담당자가 확인 후 답변 드리겠습니다.')
          Alert({
            message: '등록에 성공하였습니다. 담당자가 확인 후 답변 드리겠습니다.'
          })
          this.$emit('closePop')
        })
      })
    },
    cancel () {
      // if (confirm('문의 등록을 취소하시겠습니까?')) {
      //   this.$emit('closePop')
      // }
      Confirm({
        message: '문의 등록을 취소하시겠습니까?',
        callback: () => {
          this.$emit('closePop')
        }
      })
    },
    addImage (e) {
      e.preventDefault()
      this.$refs.inputFile.click()
      return false
    },
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(files)
      e.target.value = ''
    },
    createImage (files) {
      if (typeof FileReader === 'undefined') {
        // alert('브라우저가 이미지 업로드를 지원하지 않습니다. 브라우저를 업그레이드 해주세요.')
        Alert({
          message: '브라우저가 이미지 업로드를 지원하지 않습니다. 브라우저를 업그레이드 해주세요.'
        })
        return false
      }

      const leng = files.length
      for (let i = 0; i < leng; i++) {
        if (files[i].size > 5 * 1024 * 1024) { // 5MB
          // alert('각 사진은 최대 5MB까지 등록가능합니다.')
          Alert({
            message: '각 사진은 최대 5MB까지 등록가능합니다.'
          })
          return false
        }

        if (files[i].type.split('image').length === 1) {
          // alert('이미지 파일만 등록가능합니다.')
          Alert({
            message: '이미지 파일만 등록가능합니다.'
          })
          return false
        }
      }

      if (leng + this.images.length > 1) {
        // alert('첨부파일은 1개까지만 등록 가능합니다.')
        Alert({
          message: '첨부파일은 1개까지만 등록 가능합니다.'
        })
        return false
      }

      const that = this
      const fileitem = {}
      fileitem.file = files[0]
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = function (e) {
        fileitem.filedata = e.target.result
        that.images.push(fileitem)
      }
    },
    imageShowLoaded (event) {
      const img = event.target
      if (img.naturalWidth > 500 || img.naturalHeight > 500) {
        let tempSize = 0
        if (img.naturalWidth > img.naturalHeight) {
          tempSize = img.naturalWidth
        } else {
          tempSize = img.naturalHeight
        }
        img.width = img.naturalWidth * 0.16 * (500 / tempSize)
      } else {
        img.height = img.naturalHeight * 0.16
      }
    },
    removeImage (index) {
      // if (confirm('사진을 삭제하시겠습니까?')) {
      //   this.images.splice(index, 1)
      // }
      Confirm({
        message: '사진을 삭제하시겠습니까?',
        callback: () => {
          this.images.splice(index, 1)
        }
      })
    },
    check () {
      this.collection = !this.collection
    }
  }
}
</script>
<style scoped>
div.agree_list ul li::before {
  display: none;
}
div.agree_list ul li {
  padding-left: 0px;
}
</style>
