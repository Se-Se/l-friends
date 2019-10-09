import filters from '@/filters'
import { mapState } from 'vuex'
import { getBrowser } from '@/utils/utils'

export default {
  props: ['inquiryItem', 'index', 'currentIndex'],
  computed: {
    ...mapState('profile', ['profile']),
    inquiryType () {
      if (!this.inquiryItem) {
        return
      }
      if (this.inquiryItem.inquiryStatus === 'ASKED' || this.inquiryItem.inquiryStatus === 'IN_PROGRESS') {
        return '답변대기'
      } else {
        return '답변완료'
      }
    },
    answerDate () {
      return this.inquiryItem && this.inquiryItem.answer && filters.dateFormatStr(this.inquiryItem.answer.answerRegisterYmdt, 'yyyy.MM.dd')
    },
    answerTime () {
      return this.inquiryItem && this.inquiryItem.answer && filters.dateFormatStr(this.inquiryItem.answer.answerRegisterYmdt, 'hh:mm')
    },
    showDate () {
      return this.inquiryItem && filters.dateFormatStr(this.inquiryItem.registerYmdt, 'yyyy.MM.dd')
    },
    showTime () {
      return this.inquiryItem && filters.dateFormatStr(this.inquiryItem.registerYmdt, 'hh:mm')
    }
  },
  methods: {
    onClick () {
      this.$emit('openIndex', this.index)
      if (this.currentIndex === this.index) {
        this.$emit('openIndex', '-1')
      }
    },
    downloadIamge (imgsrc, name) {
      const url = imgsrc
      this.convertUrlToBase64(url).then((base64) => {
        const blob = this.convertBase64UrlToBlob(base64)
        if (getBrowser() === 'IE' || getBrowser() === 'Edge') {
          window.navigator.msSaveBlob(blob, name)
        } else {
          const a = document.createElement('a')
          const body = document.querySelector('body')
          a.download = name || 'image'
          a.href = URL.createObjectURL(blob)
          a.style.display = 'none'
          body.appendChild(a)
          a.click()
          body.removeChild(a)
          window.URL.revokeObjectURL(a.href)
        }
      })
    },
    convertUrlToBase64 (url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = url
        img.onload = function () {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, img.width, img.height)
          const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
          const dataURL = canvas.toDataURL('image/' + ext)
          const base64 = {
            dataURL: dataURL,
            type: 'image/' + ext,
            ext: ext
          }
          resolve(base64)
        }
      })
    },
    convertBase64UrlToBlob (base64) {
      const parts = base64.dataURL.split('base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; i++) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    }
  }
}
