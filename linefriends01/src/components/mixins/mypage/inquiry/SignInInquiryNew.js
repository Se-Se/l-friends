import { mapState, mapGetters, mapActions } from 'vuex'
import { addClass, removeClass } from '@/utils/utils'
import { stringToByte } from '@/utils/StringUtils'
import { Alert, Confirm } from '@/utils/event-bus'
import $ from 'jquery'
export default {
  data () {
    return {
      inquiryPopup: false,
      cancleConfirmMsg: '1:1 문의 등록을 취소하시겠습니까?',
      inquiryTypeNo: '',
      inquiryTitle: '',
      inquiryContent: '',
      answerEmailSendYn: true,
      answerSmsSendYn: true,
      originalFileName: '',
      uploadFile: '',
      bodyScrollTop: 0,
      inquiryTypeName: '',
      inquiryTypeDescription: '',
      input: {
        type: 'text',
        placeholder: '문의 제목을 입력해주세요.',
        value: this.inquiryTitle
      },
      form: {
        answerEmailSendYn: false,
        answerSmsSendYn: false,
        captcha: 'string',
        email: 'example@email.com',
        inquiryContent: '',
        inquiryTitle: '',
        inquiryTypeNo: 241,
        orderNo: '',
        originalFileName: '',
        productNo: 0,
        uploadedFileName: ''
      }
    }
  },
  computed: {
    ...mapState('common', ['malls']),
    ...mapState('profile', ['profile']),
    ...mapState('common', ['uploadFilesData']),
    ...mapGetters('common', ['inquiryType']),
    inquiryTypeItems () {
      if (this.malls && this.malls.inquiryType) {
        return this.malls.inquiryType.map(type => {
          return { label: type.inquiryTypeName, value: type.inquiryTypeNo, description: type.inquiryTypeDescription }
        })
      }
    },
    inquiryTypeOption () {
      let options = []
      if (this.inquiryType) {
        for (const option of this.inquiryType) {
          options.push({
            label: option.inquiryTypeName,
            value: option.inquiryTypeNo,
            description: option.inquiryTypeDescription
          })
        }
      }

      return options
    }
  },
  mounted () {
    // this.inquiryTypeNo = this.malls.inquiryType[0].inquiryTypeNo
  },
  methods: {
    ...mapActions('profileinquiry', ['signInInquiries']),
    showInquiryPopup () {
      this.inquiryPopup = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
    },
    closeInquiryPopup () {
      Confirm({
        message: this.cancleConfirmMsg,
        callback: () => {
          removeClass(document.body, 'no_scroll')
          document.body.style.top = '0px'
          window.scrollTo(0, this.bodyScrollTop * -1)
          Object.assign(this.$data, this.$options.data())
          this.$refs.selectBox.initSelectedItem()
          // $('html').css('overflow', 'scroll')
        }
      })
    },
    complete () {
      this.$refs.selectBox.initSelectedItem()
      removeClass(document.body, 'no_scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
      Object.assign(this.$data, this.$options.data())
    },
    selectInquiryType (item) {
      this.inquiryTypeNo = item.value
      this.inquiryTypeDescription = item.description
    },
    signInInquiry () {
      if (!this.checkForm()) {
        return
      }
      const iparam = {
        inquiryTypeNo: this.inquiryTypeNo,
        inquiryContent: this.inquiryContent,
        inquiryTitle: this.inquiryTitle,
        answerEmailSendYn: this.answerEmailSendYn,
        originalFileName: this.originalFileName,
        uploadedFileName: ''
      }
      this.uploadFileAsync().then(res => {
        if (res) {
          iparam.uploadedFileName = res.data.imageUrl
        }
        return this.$store.dispatch('profileinquiry/signInInquiries', iparam)
      }).then(res => {
        // 922 issue
        Alert({
          // title: '1:1 문의',
          message: '1:1 문의가 등록되었습니다.',
          callback: () => {
            this.$store.dispatch('profileinquiry/fetchInquiries', { pageNumber: 1 })
            this.complete()
            this.$emit('initOpenI', '-1')
          }
        })
      })
    },
    checkForm () {
      if (this.inquiryTypeNo === '') {
        // alert('문의유형을 선택하세요.')
        Alert({
          message: '문의유형을 선택하세요.'
        })
        return false
      }
      if (!this.inquiryTitle) {
        // alert('문의제목을 입력해 주세요.')
        Alert({
          message: '문의제목을 입력해 주세요.'
        })
        return false
      }
      if (!this.inquiryContent) {
        // alert('문의내용을 입력해 주세요.')
        Alert({
          message: '문의내용을 입력해 주세요.'
        })
        return false
      }
      return true
    },
    changeFile (event) {
      this.uploadFile = event.target.files[0] ? event.target.files[0] : this.uploadFile
      if (stringToByte(this.uploadFile.name).length > 100) {
        // alert('100 byte 미만의 파일명을 등록해주세요.')
        Alert({
          message: '100 byte 미만의 파일명을 등록해주세요.'
        })
        this.uploadFile = ''
        this.originalFileName = ''
      } else {
        this.originalFileName = this.uploadFile.name
      }
      event.target.value = ''
    },
    deleteFile (event) {
      this.uploadFile = ''
      this.originalFileName = ''
    },
    uploadFileAsync () {
      if (!this.uploadFile) {
        return Promise.resolve()
      }
      let data = new FormData()
      data.append('file', this.uploadFile)
      return this.$store.dispatch('common/uploadImages', data)
    },
    async submit () {
      if (!this.checkForm()) {
        return
      }

      const iparam = {
        inquiryTypeNo: this.inquiryTypeNo,
        inquiryContent: this.inquiryContent,
        inquiryTitle: this.inquiryTitle,
        answerEmailSendYn: this.answerEmailSendYn,
        originalFileName: this.originalFileName,
        uploadedFileName: ''
      }

      const res = await this.uploadFileAsync()
      if (res) {
        iparam.uploadedFileName = res.data.imageUrl
      }

      await this.$store.dispatch('profileinquiry/signInInquiries', iparam)

      Alert({
        // title: '1:1 문의',
        message: '1:1 문의가 등록되었습니다'
      })
      this.$emit('complete')
    }
  }
}
