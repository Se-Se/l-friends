<template>
  <div class="popup-layer" v-show="isShow">
    <div class="popup_common popup_size_5">
      <div class="roller_area">
        <h1>{{mode === 'WRITE'?'レビューの作成':'レビューの修正'}}</h1>
        <div class="con">
          <table class="table_info sp_2">
            <tbody>
              <tr>
                <th><span class="must">満足度</span></th>
                <td>
                  <div class="review_info">
                    <span class="review_score" @click.stop="getPoint" ref="star">
                      <span class="graph sp" :style="{width: starPoint * 20 + `%`}"><strong class="blind">{{starPoint}}</strong></span>
                      <span class="blind">/ 5.0</span>
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <th><span class="must">商品レビュー</span></th>
                <td>
                  <div class="textarea_evaluate">
                    <textarea placeholder="- 広告、著作権侵害、いやがらせ、誹謗、わいせつなど、商品と関係ない内容投稿は任意に削除される可能性があります。
- レビューと関係ない個人情報などを記入しないよう注意してください。
- 商品にご不明な点がございましたら、商品のお問い合わせから質問してください。" v-model="content" maxlength="1000"></textarea>
                  </div>
                </td>
              </tr>
              <tr>
                <th>添付</th>
                <td>
                  <div class="btn_file">
                    <input type="file" id="fileElem" class="fileElem" name="fileElem" ref="inputFile" multiple="" accept="image/*" @change="onFileChange">
                    <label class="btn btn_primary size_m" for="fileElem" @click="addImage">ファイル選択</label>
                  </div>
                  <div class="upload_view">
                    <ul>
                      <li v-for="(image, index) in images" :key="index">
                        <div class="photo_wrap">
                          <div class="thumbnail">
                            <img :src="image.filedata" alt="">
                          </div>
                        </div>
                        <button class="btn_close" @click="removeImage(index)">close</button>
                      </li>
                    </ul>
                  </div>
                  <div class="tip_1"><span class="txt_color_blue">最大10件までアップロードできます。</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul class="btn_list btn_list-margin">
          <li>
            <button class="btn" @click="close">キャンセル</button>
          </li>
          <li>
            <button class="btn btn_green" @click="registReview">{{mode === 'WRITE'?'登録':'修正'}}</button>
          </li>
        </ul>
      </div>
      <button class="btn_close" @click="close">close</button>
    </div>
  </div>
</template>
<script>
import { Alert, Confirm } from '@/components/common/modal'

export default {
  name: 'ReviewPop',
  data () {
    return {
      starPoint: 0,
      content: '',
      images: [],
      reviewNo: 0
    }
  },
  props: {
    mode: {
      type: String,
      default: 'WRITE'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    review: {
      type: Object,
      default: null
    }
  },
  methods: {
    getPoint () {
      let starNum = Math.ceil(event.offsetX / (this.$refs.star.clientWidth / 5))
      this.selectStar(starNum)
    },
    selectStar (point) {
      this.starPoint = point
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
          message: 'ブラウザが画像のアップロードをサポートしていません。ブラウザをアップグレードしてください。'
        })
        return false
      }

      const leng = files.length
      for (let i = 0; i < leng; i++) {
        if (files[i].size > 10485760) { // 10MB
          Alert({
            message: '各画像は、最大10MBまで登録可能です。'
          })
          return false
        }

        if (files[i].type.split('image').length === 1) {
          Alert({
            message: '画像ファイルのみ登録可能です。'
          })
          return false
        }
      }

      if (leng + this.images.length > 10) {
        Alert({
          message: '添付ファイルは、10個まで登録可能です。'
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
    close (okFlg) {
      this.starPoint = 0
      this.images = []
      this.content = ''
      // document.body.style.top = '0px'
      // window.scrollTo(0, this.bodyScrollTop * -1)
      this.$emit('closePop', okFlg)
    },
    removeImage (index) {
      Confirm('写真を削除しますか？').then((result) => {
        if (result) this.images.splice(index, 1)
      })
    },
    registReview () {
      if (this.starPoint === 0) {
        Alert({
          message: '満足度をお選びください。'
        })
        return
      }
      if (this.content.trim() === '') {
        Alert({
          message: 'レビュー本文を入力してください。'
        })
        return
      }
      // $('html').css('overflow', 'scroll')
      const paramsReview = {
        productNo: this.review.productNo,
        optionNo: this.review.optionNo,
        orderOptionNo: this.review.orderOptionNo,
        rate: this.starPoint,
        content: this.content,
        reviewNo: this.reviewNo,
        orderAddFlg: ''
      }
      const dispatch = this.$store.dispatch
      Promise.all(this.images.map(image => {
        if (image.file !== undefined) {
          const data = new FormData()
          data.append('file', image.file)
          return dispatch('common/uploadImages', data)
        }
      })).then(ret => {
        const urls = ret.filter(res => res !== undefined).map(res => res.data[0].uploadedFileName).concat(this.images.filter(i => i.file === undefined).map(i => i.filedata))
        paramsReview.urls = urls
        if (this.mode === 'WRITE') {
          dispatch('review/postProductReviews', paramsReview).then(() => {
            Alert({ message: 'レビューの作成が完了しました。' }).then(this.close(true))
          })
        } else { // EDIT
          dispatch('review/putProductReviews', paramsReview).then(() => {
            Alert({ message: 'レビュー修正が完了しました。' }).then(this.close)
          })
        }
      })
    },
    setPopupData (review) {
      this.starPoint = review.rate
      this.content = review.content
      this.reviewNo = review.reviewNo
      this.images = []
      review.fileUrls.forEach(i => {
        let fileItem = {}
        fileItem.filedata = i
        this.images.push(fileItem)
      })
    }
  },
  destroyed () {
    this.$store.commit('CLOSE_POP')
  }
}
</script>
