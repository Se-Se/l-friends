<template>
  <modal-layer-popup :visible.sync="active" :popup_size_class="'roller_area popup_size_5'" popup_name="orderAddreviewPopupName" @closeOrderAddReviewPopup="closeOrderAddReviewPopup" :width="680">
    <h1 slot="title">상품평 작성</h1>
    <div class="con">
      <table class="table_info sp_2">
        <tbody>
          <tr>
            <th><span class="must">만족도</span></th>
            <td>
              <div class="review_info">
                <span class="review_score" @click.stop="getPoint" ref="star">
                  <span class="graph sp" :style="{width: starPoint * 20 + `%`}">
                    <strong class="blind">{{starPoint}}</strong>
                  </span>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <th><span class="must">상품평</span></th>
            <td :class="{
              active : textArea === true
            }" @click="textAreaChk">
              <textarea :placeholder="$t('mypage.productinquiry.placeholder.pc.content')" v-model="content" maxlength="1000"></textarea>
            </td>
          </tr>
          <tr>
            <th>첨부</th>
            <td>
              <!-- <div>
              <file-item 
                :files="files"
                :max="10"
                :imgCount="imgCount"
                @addImageCount="addImageCount"
              />
              <information-title info="사진은 최대 10장까지 등록 가능합니다." />
            </div> -->
              <div class="btn_file review-file">
                <input type="file" id="fileElem" class="fileElem" name="fileElem" multiple ref="inputFile" accept="image/*" @change="onFileChange">
                <label class="btn btn_gray2 review-file__action" for="fileElem" @click="addImage">파일선택</label>
              </div>
              <div class="upload_view_new">
                <ul>
                  <template v-for="(image, index) in images">
                    <li :key="index">
                      <product-img :image='image.filedata'></product-img>
                      <button class="btn_close review-file__close" @click="removeImage(index)">close</button>
                    </li>
                  </template>
                </ul>
              </div>
              <div class="review-tip">
                <span>사진은 최대 10장까지 등록 가능합니다.</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="txt_ex_2">
        <p>상품평 작성을 완료하시면 구매확정으로 처리됩니다.</p>
      </div>
      <div class="btn_list">
        <button class="btn cancel" @click="closeOrderAddReviewPopup">취소</button>
        <button class="btn add" @click.prevent="registReview">등록</button>
      </div>
    </div>
  </modal-layer-popup>
</template>
<script>
import ModalLayerPopup from '@/components/pc/popup/ModalLayerPopupNew'
import { optionFormat } from '@/utils/StringUtils'
import { addClass, removeClass } from '@/utils/utils'
import ProductImg from '@/components/common/ProductImgNew'
import FileItem from '@/components/pc/layout/common/FileItem'
import InformationTitle from '@/components/pc/layout/common/InformationTitle'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  data () {
    return {
      active: false,
      starPoint: 0,
      textArea: true,
      content: '',
      images: [],
      reviewNo: 0,
      bodyScrollTop: 0,
      files: {
        choiceText: '파일선택',
        data: 'file'
      },
      imgCount: 0
    }
  },
  computed: {},
  components: {
    ModalLayerPopup,
    ProductImg,
    FileItem,
    InformationTitle
  },
  props: ['orderOption', 'isShowReview'],
  methods: {
    optionFormat (optionUsed, optionType, name, value, inputs, addPrice, orderCnt) {
      return optionFormat(optionUsed, optionType, name, value, inputs, addPrice, orderCnt)
    },
    selectStar (point) {
      this.starPoint = point
    },
    getPoint () {
      let starNum = Math.ceil(event.offsetX / (this.$refs.star.clientWidth / 5))
      this.selectStar(starNum)
    },
    addImage (e) {
      e.preventDefault()
      this.$refs.inputFile.click()
      return false
    },
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(files)
      e.target.value = ''
    },
    createImage (files) {
      if (typeof FileReader === 'undefined') {
        Alert({
          message: '브라우저가 이미지 업로드를 지원하지 않습니다. 브라우저를 업그레이드 해주세요.'
        })
        return false
      }

      const leng = files.length
      for (let i = 0; i < leng; i++) {
        if (files[i].size > 1048576) { // 1MB
          Alert({
            message: '각 사진은 최대 1MB까지 등록가능합니다.'
          })
          return false
        }

        if (files[i].type.split('image').length === 1) {
          Alert({
            message: '이미지 파일만 등록가능합니다.'
          })
          return false
        }
      }

      if (leng + this.images.length > 10) {
        Alert({
          message: '첨부파일은 10개까지만 등록 가능합니다.'
        })
        return false
      }

      const that = this
      for (let i = 0; i < leng; i++) {
        const fileitem = {}
        fileitem.file = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(files[i])
        reader.onload = function (e) {
          fileitem.filedata = e.target.result
          that.images.push(fileitem)
        }
      }
    },
    removeImage (index) {
      Confirm({
        message: '사진을 삭제하시겠습니까?',
        callback: () => {
          this.images.splice(index, 1)
        }
      })
      // if (confirm('사진을 삭제하시겠습니까?')) {
      //   this.images.splice(index, 1)
      // }
    },
    registReview () {
      if (this.starPoint === 0) {
        Alert({
          message: '만족도를 선택해 주세요.'
        })
        return
      }
      if (this.content.trim() === '') {
        Alert({
          message: '상품평 본문을 입력해주세요.'
        })
        return
      }
      const paramsReview = {
        productNo: this.orderOption.productNo,
        optionNo: this.orderOption.optionNo,
        orderOptionNo: this.orderOption.orderOptionNo,
        rate: this.starPoint,
        content: this.content,
        reviewNo: this.reviewNo,
        orderAddFlg: 'order'
      }
      const dispatch = this.$store.dispatch
      Promise.all(this.images.map(image => {
        if (image.file !== undefined) { // 이미 등록된 URL이 아니면
          const data = new FormData()
          data.append('file', image.file)
          return dispatch('common/uploadImages', data)
        }
      })).then(ret => {
        const urls = ret.filter(res => res !== undefined).map(res => res.data.imageUrl).concat(this.images.filter(i => i.file === undefined).map(i => i.filedata))
        paramsReview.urls = urls
        dispatch('profilereview/postProductReviews', paramsReview).then(() => {
          // 922 issue
          Alert({
            message: '상품평 작성이 완료되었습니다.',
            callback: () => {
              this.active = false
              this.$emit('update:isShowReview', false)
              this.starPoint = 0
              this.images = []
              this.content = ''
              window.location.href = '/mypage/orderlist'
            }
          })
        })
      })
    },
    closeOrderAddReviewPopup () {
      this.$emit('update:isShowReview', false)
      this.active = false
      this.starPoint = 0
      this.images = []
      this.content = ''
      removeClass(document.body, 'no_scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
      this.clearImageCount()
    },
    openOrderAddreviewPopup () {
      this.active = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
    },
    textAreaChk () {
      this.textArea = false
    },
    clearImageCount () {
      this.imgCount = 0
    },
    addImageCount () {
      this.imgCount++
    }
  },
  watch: {
    active (newValue, oldValue) {
      if (!this.active) {
        this.imgCount = 0
      }
    }
  }
}
</script>
<style scoped>
.popup_common .tip_1 {
  margin: 0 !important;
  position: static !important;
  margin-top: 20px !important;
  box-sizing: border-box !important;
  font-size: 13px !important;
  padding-left: 21px !important;
}
.popup_common .txt_ex_2 {
  float: none !important;
}

.must {
  position: relative;
}

.must:after {
  display: block;
  content: "";
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #00d664;
  position: absolute;
  top: 0;
  right: -7px;
}
</style>
