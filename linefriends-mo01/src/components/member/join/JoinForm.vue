<template>
  <div class="login-wrapper login-sign-wrapper">
    <ul class="input_list">
      <li>
        <p class="input_name">
          <span class="login-new-ico">メールアドレス(ID)</span>
        </p>
        <div class="input_text">
          <input type="text" v-model="email" placeholder="ログインID" @keyup.enter="validationEmail" @blur="validationEmail" :class="error.email ? 'error':''" />
        </div>
        <p v-if="error.email" class="error-info">{{error.email}}</p>
      </li>
      <li>
        <p class="input_name">
          <span class="login-new-ico">パスワード</span>
        </p>
        <div class="input_text">
          <input type="password" maxlength="20" v-model="password" placeholder="8文字以上/英文字、数字、記号を含む" @keyup.enter="validationPwd" @blur="validationPwd" :class="error.password ? 'error':''" />
        </div>
        <p v-if="error.password" class="error-info">{{error.password}}</p>
      </li>
      <li>
        <p class="input_name">
          <span class="login-new-ico">パスワード再確認</span>
        </p>
        <div class="input_text">
          <input type="password" v-model="passwordConfirm" placeholder="パスワードをもう一度入力" @keyup.enter="validationConfirmPwd" @blur="validationConfirmPwd" :class="error.passwordConfirm ? 'error':''" />
        </div>
        <p v-if="error.passwordConfirm" class="error-info">{{error.passwordConfirm}}</p>
      </li>
      <li>
        <p class="input_name">
          <span class="login-new-ico">ニックネーム</span>
        </p>
        <div class="input_text"><input type="text" maxlength="20" v-model="nickName" @keyup.enter="validationNickNm" @blur="validationNickNm" :class="error.nickName ? 'error':''" placeholder="3～20文字まで入力"></div>
        <p v-if="error.nickName" class="error-info">{{error.nickName}}</p>
      </li>
      <li>
        <p class="input_name"><span>電話番号</span></p>
        <div class="telephone">
          <input type="text" :maxlength="contectOneLengh" v-model="myInput.contactOne" @keypress="onlyNumber" @keyup="phoneNumberCheck">
          <span>-</span>
          <input type="text" :maxlength='contactTwoLengh' required="" v-model="showContactTwo" ref="contactTwo" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
          <span>-</span>
          <input type="text" maxlength="4" required="" v-model="showContactThree" ref="contactThree" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
        </div>
      </li>
      <li>
        <p class="input_name">生年月日</p>
        <div class="input_text">
          <input readonly="" type="text" ref="birthDate" id="birthDate" placeholder="YYYY-MM-DD">
        </div>
      </li>
    </ul>
    <button class="btn btn_green" @click="onSignUp">次へ</button>
  </div>
</template>
<script>
import { joinPasswordValidation, checkMail, validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
import Rolldate from 'rolldate'
import { Alert } from '@/components/common/modal'
export default {
  data () {
    return {
      error: {},
      email: null,
      password: null,
      passwordConfirm: null,
      nickName: null,
      marketAgree: null,
      rd: null,
      theBirthDay: `${new Date().getFullYear() - 14}-${new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()}`,
      contactTwoLengh: 4,
      contectOneLengh: 5,
      myInput: {
        contactOne: '',
        contactTwo: '',
        contactThree: ''
      }
    }
  },
  computed: {
    showContactTwo: {
      get () {
        return this.myInput.contactTwo
      },
      set (value) {
        this.myInput.contactTwo = changeKoreanToEmptyString(value)
      }
    },
    showContactThree: {
      get () {
        return this.myInput.contactThree
      },
      set (value) {
        this.myInput.contactThree = changeKoreanToEmptyString(value)
      }
    }
  },
  methods: {
    birthDateFunc () {
      this.rd = new Rolldate({
        el: '#birthDate',
        format: 'YYYY-MM-DD',
        beginYear: new Date().getFullYear() - 114,
        endYear: new Date().getFullYear() - 14,
        value: this.theBirthDay,
        lang: {
          title: '生年月日',
          cancel: 'キャンセル',
          confirm: '確認'
        },
        confirm: (date) => {
          this.theBirthDay = date
        }
      })
    },
    validationEmail () {
      if (!checkMail(this.email)) {
        this.error = {
          email: 'メールアドレスの形式が正しくありません。'
        }
        return false
      }
      this.$store.dispatch('profile/emailExits', this.email).then((result) => {
        if (result.data.exist === true) {
          this.error = {
            email: '既に使用されているメールです。'
          }
          return false
        }
      })
      this.error = {}
    },
    validationPwd () {
      if (!this.password) {
        this.error = {
          password: 'パスワードを入力してください。'
        }
        return false
      }
      if (this.password.length < 8) {
        this.error = {
          password: 'パスワードは8桁以上入力してください。'
        }
        return false
      }
      const validationResult = joinPasswordValidation(this.password)
      if (!validationResult.code) {
        this.error = {
          password: 'パスワードは' + validationResult.pattern + 'を含めて入力してください。'
        }
        return false
      }
      if (this.passwordConfirm && this.password !== this.passwordConfirm) {
        this.error = {
          passwordConfirm: '同じパスワードを入力してください。'
        }
        return false
      }
      this.error = {
        password: '',
        passwordConfirm: ''
      }
      return true
    },
    validationConfirmPwd () {
      if (!this.passwordConfirm) {
        this.error = {
          passwordConfirm: 'パスワード再確認を入力してください。'
        }
        return false
      }

      if (this.password !== this.passwordConfirm) {
        this.error = {
          passwordConfirm: '同じパスワードを入力してください。'
        }
        return false
      }
      this.error = {
        passwordConfirm: ''
      }
      return true
    },
    validationNickNm () {
      if (!this.nickName) {
        this.error = {
          nickName: 'ニックネームを入力してください。'
        }
        return false
      }
      if (this.nickName.length < 3) {
        this.error = {
          nickName: 'ニックネームは3文字以上入力してください。'
        }
        return false
      }
      this.error = {
        nickName: ''
      }
      return true
    },
    onSignUp () {
      // this.error = {}
      if (!checkMail(this.email)) {
        this.error = {
          email: 'メールアドレスの形式が正しくありません。'
        }
        return false
      }
      this.$store.dispatch('profile/emailExits', this.email).then((result) => {
        if (result.data.exist === true) {
          this.error = {
            email: '既に使用されているメールです。'
          }
          return false
        }
        if (!this.validationPwd()) return false
        if (!this.validationConfirmPwd()) return false
        if (!this.validationNickNm()) return false
        let mobileNo = this.myInput.contactOne + this.myInput.contactTwo + this.myInput.contactThree
        if (mobileNo !== '') {
          if (this.myInput.contactOne === '' || this.myInput.contactTwo === '' || this.myInput.contactThree === '' || this.myInput.contactOne.substring(0, 1) !== '0' || mobileNo.length > 11) {
            Alert({
              message: '正しい電話番号を入力してください。'
            })
            return false
          }
        }
        this.$store.dispatch('profile/signUp', {
          email: this.email,
          memberId: this.email,
          password: this.password,
          nickname: this.nickName,
          directMailAgreed: this.marketAgree,
          mobileNo: mobileNo !== '' ? mobileNo : null,
          birthday: this.theBirthDay.split('-').join('')
        }).then(async (response) => {
          this.$store.dispatch('authentication/sendMailCode', {
            email: this.email,
            uri: `${location.protocol}//${location.host}/m/member/join/complete`
          }).then((response) => {
            this.$router.push({
              path: '/m/member/join/sendEmail',
              query: {
                email: this.email
              }
            })
          })
        })
      })
    },
    validateNumber (event) {
      validateNumber(event)
    },
    onlyNumber ($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
        $event.preventDefault()
      }
    },
    phoneNumberCheck ($event) {
      switch (this.myInput.contactOne.length) {
        case 5:
          this.contactTwoLengh = 1
          break
        case 4:
          this.contactTwoLengh = 2
          break
        case 3:
          this.contactTwoLengh = 4
          break
        default:
          this.contactTwoLengh = 4
          break
      }

      switch (this.myInput.contactTwo.length) {
        case 4:
          this.contectOneLengh = 3
          break
        case 3:
          this.contectOneLengh = 3
          break
        case 2:
          this.contectOneLengh = 4
          break
        case 1:
          this.contectOneLengh = 5
          break
        default:
          this.contectOneLengh = 5
          break
      }
    }
  },
  mounted () {
    if (this.$route.query.marketAgree) {
      this.marketAgree = this.$route.query.marketAgree === 'true'
    } else {
      this.$router.push('/m/member/join')
    }
    this.birthDateFunc()
  }
}
</script>
