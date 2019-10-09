import { optionFormat } from '@/utils/StringUtils'
import { addClass, removeClass } from '@/utils/utils'
import $ from 'jquery'
import ProductImg from '@/components/common/ProductImgNew'
import { mapActions } from 'vuex'
import StarRating from '@/components/pc/layout/common/StarRating'
import FileItem from '@/components/pc/layout/common/FileItem'
import InformationTitle from '@/components/pc/layout/common/InformationTitle'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  data () {
    return {
      popupOn: false,
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
      }
    }
  },
  components: {
    ProductImg,
    StarRating,
    FileItem,
    InformationTitle
  },
  props: {
    review: {},
    mode: {
      type: String,
      default: 'WRITE' // 'MODIFY
    }
  },
  methods: {
    ...mapActions('member', ['mySummary']),
    getPoint () {
      let starNum = Math.ceil(event.offsetX / (this.$refs.star.clientWidth / 5))
      this.selectStar(starNum)
    },
    optionFormat (optionUsed, optionType, name, value, inputs, addPrice, orderCnt) {
      return optionFormat(optionUsed, optionType, name, value, inputs, addPrice, orderCnt)
    },
    imageShowLoaded (event) {
      const img = event.target
      if (img.naturalWidth > 500 || img.naturalHeight > 500) {
        if (img.naturalWidth > img.naturalHeight) {
          img.width = 100
          img.height = img.naturalHeight * 0.2 * (500 / img.naturalWidth)
        } else {
          img.height = 100
          img.width = img.naturalWidth * 0.2 * (500 / img.naturalHeight)
        }
      } else {
        img.width = img.naturalWidth * 0.2
        img.height = img.naturalHeight * 0.2
      }
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
      $('html').css('overflow', 'scroll')
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
        if (image.file !== undefined) { // 이미 등록된 URL이 아니면
          const data = new FormData()
          data.append('file', image.file)
          return dispatch('common/uploadImages', data)
        }
      })).then(ret => {
        const urls = ret.filter(res => res !== undefined).map(res => res.data.imageUrl).concat(this.images.filter(i => i.file === undefined).map(i => i.filedata))
        paramsReview.urls = urls
        if (this.mode === 'WRITE') {
          dispatch('profilereview/postProductReviews', paramsReview).then(() => {
            this.mySummary()
            Alert({
              message: '상품평 작성이 완료되었습니다.',
              callback: this.callback
            })
          })
        } else { // MODIFY
          dispatch('review/putProductReviews', paramsReview).then(() => {
            Alert({
              message: '상품평 수정이 완료되었습니다.',
              callback: this.callback
            })
          })
        }
      })
    },
    callback () {
      this.$store.dispatch('member/mySummary')
      this.popupOn = false
      this.starPoint = 0
      this.images = []
      this.content = ''
      removeClass(document.body, 'no_scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
      this.$emit('save')
      this.$emit('close')
    },
    openModifyPopup () {
      this.starPoint = this.review.rate
      this.content = this.review.content
      this.reviewNo = this.review.reviewNo
      this.images = []
      this.review.fileUrls.forEach(i => {
        let fileItem = {}
        fileItem.filedata = i
        this.images.push(fileItem)
      })
      this.popupOn = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
      // $('html').css('overflow', 'hidden')
      $('#container').css('z-index', 'auto')
    },
    closePopup () {
      this.popupOn = false
      this.starPoint = 0
      this.images = []
      this.content = ''
      removeClass(document.body, 'no_scroll')
      $('html').css('overflow', 'scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
      $('#container').css('z-index', 1)
    },
    openAddPopup () {
      this.popupOn = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
      // $('html').css('overflow', 'hidden')
      $('#container').css('z-index', 'auto')
    },
    textAreaChk () {
      this.textArea = false
    }
  },
  mounted () {
    if (this.$route.query.orderOptionNo !== undefined && Number(this.$route.query.orderOptionNo) === this.review.orderOptionNo && this.mode === 'WRITE') {
      this.popupOn = true
    }
  }
}
