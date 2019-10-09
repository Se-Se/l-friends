<template>
  <div class="login-wrapper">
    <h2>会員登録</h2>
    <ul class="input_list">
      <li>
        <p class="input_name"><span class="must">メールアドレス(ID)</span></p>
        <div class="input_text">
          <input type="text" v-model="email" placeholder="ログインID" @keyup.enter="validationEmail" @blur="validationEmail" :class="error.email ? 'error':''" />
        </div>
        <p v-if="error.email" class="error-info">{{error.email}}</p>
      </li>
      <li>
        <p class="input_name"><span class="must">パスワード</span></p>
        <div class="input_text">
          <input type="password" maxlength="20" v-model="password" placeholder="8文字以上/英文字、数字、記号を含む" @keyup.enter="validationPwd" @blur="validationPwd" :class="error.password ? 'error':''" />
        </div>
        <p v-if="error.password" class="error-info">{{error.password}}</p>
      </li>
      <li>
        <p class="input_name"><span class="must">パスワード再確認</span></p>
        <div class="input_text">
          <input type="password" v-model="passwordConfirm" placeholder="パスワードをもう一度入力" @keyup.enter="validationConfirmPwd" @blur="validationConfirmPwd" :class="error.passwordConfirm ? 'error':''" />
        </div>
        <p v-if="error.passwordConfirm" class="error-info">{{error.passwordConfirm}}</p>
      </li>
      <li>
        <p class="input_name"><span class="must">ニックネーム</span></p>
        <div class="input_text">
          <input v-model="nickName" @keyup.enter="validationNickNm" maxlength="20" @blur="validationNickNm" type="text" :class="error.nickName ? 'error':''" placeholder="3～20文字まで入力" />
        </div>
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
        <p class="input_name"><span>生年月日</span></p>
        <div class="select_content cf">
          <div class="select_area">
            <div class="bx_select" v-click-outside="closeYear">
              <div class="txt_select year_select" :class="birthClick.yearClick ? 'on' : ''" @click="birthClick.yearClick = !birthClick.yearClick">
                <span class="select_vle">{{birthObj.year}}</span>
                <span class="ico_arrow"></span>
              </div>
              <ul class="lst_select_content">
                <li v-for="(key, index) in BirthYmd().year" :key="index">
                  <a href="#" @click.prevent="theYearClick(key)">{{key}}</a>
                </li>
              </ul>
            </div>
            <span class="date_word">年</span>
          </div>
          <div class="select_area">
            <div class="bx_select" v-click-outside="closeMonth">
              <div class="txt_select month_select" :class="birthClick.monthClick ? 'on' : ''" @click="birthClick.monthClick = !birthClick.monthClick">
                <span class="select_vle">{{birthObj.month}}</span>
                <span class="ico_arrow"></span>
              </div>
              <ul class="lst_select_content">
                <li v-for="(key, index) in BirthYmd().month" :key="index">
                  <a href="#" @click.prevent="theMonthClick(key)">{{key}}</a>
                </li>
              </ul>
            </div>
            <span class="date_word">月</span>
          </div>
          <div class="select_area">
            <div class="bx_select" v-click-outside="closeDay">
              <div class="txt_select day_select" :class="birthClick.dayClick ? 'on' : ''" @click="birthClick.dayClick = !birthClick.dayClick">
                <span class="select_vle">{{birthObj.day}}</span>
                <span class="ico_arrow"></span>
              </div>
              <ul class="lst_select_content">
                <li v-for="(key, index) in BirthYmd(birthObj.year, birthObj.month).day" :key="index">
                  <a href="#" @click.prevent="theDayClick(key)">{{key}}</a>
                </li>
              </ul>
            </div>
            <span class="date_word day_word">日</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="member-layout">
      <div class="table-grid">
        <div class="table-grid__left">
          <span class="bx_input">
            <input id="input1" type="checkbox" v-model="agreeAll" @change="clickAgreeAll()" />
            <label for="input1">規約への同意</label>
          </span>
        </div>
      </div>
      <div class="table-grid">
        <div class="table-grid__left">
          <span class="bx_input">
            <input id="input2" type="checkbox" v-model="serviceAgree" @change="clickServiceAgree()" />
            <label for="input2">サービス利用約款(必須)</label>
          </span>
        </div>
        <div class="table-grid__right">
          <span><a @click="openTermService()" class="txt_1" href="#">表示</a></span>
        </div>
      </div>
      <div class="table-grid">
        <div class="table-grid__left">
          <span class="bx_input">
            <input id="input3" type="checkbox" v-model="privateAgree" @change="clickPrivateAgree()" />
            <label for="input3">個人情報の取得・利用同意(必須)</label>
          </span>
        </div>
        <div class="table-grid__right">
          <span><a @click="openTermPrivate()" class="txt_1" href="#">表示</a></span>
        </div>
      </div>
      <div class="table-grid">
        <div class="table-grid__left">
          <span class="bx_input">
            <input @change="clickMarketAgree()" id="input4" type="checkbox" v-model="marketAgree" />
            <label for="input4">広告の受信同意(選択)</label>
          </span>
        </div>
      </div>
      <div class="table-grid">
        <div class="table-grid__left">
          <span class="bx_input">
            <input id="input5" type="checkbox" v-model="adultAgree" />
            <label for="input5">満14歳以上です。(必須)</label>
          </span>
        </div>
      </div>
    </div>
    <p v-if="error.agree" class="error-info">必須項目にチェックしてください</p>
    <button class="btn btn_green mar-top-32" @click="onSignUp">次へ</button>
  </div>
</template>
<script>
import { joinPasswordValidation, checkMail, validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
import { BirthYmd } from '@/utils/dateUtils'
import ClickOutside from 'vue-click-outside'
import { Alert } from '@/components/common/modal'
export default {
  data () {
    return {
      error: {},
      email: null,
      password: null,
      passwordConfirm: null,
      nickName: null,
      agreeAll: false,
      serviceAgree: null,
      privateAgree: null,
      marketAgree: null,
      adultAgree: null,
      birthObj: {
        year: new Date().getFullYear() - 14,
        month: new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1),
        day: new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
      },
      birthClick: {
        yearClick: false,
        monthClick: false,
        dayClick: false
      },
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
  directives: {
    ClickOutside
  },
  methods: {
    BirthYmd,
    closeYear () {
      this.birthClick.yearClick = false
    },
    closeMonth () {
      this.birthClick.monthClick = false
    },
    closeDay () {
      this.birthClick.dayClick = false
    },
    theYearClick (key) {
      this.birthObj.year = key
      this.birthObj.month = '01'
      this.birthObj.day = '01'
      this.birthClick.yearClick = false
      this.birthClick.monthClick = false
      this.birthClick.dayClick = false
    },
    theMonthClick (key) {
      this.birthObj.month = key
      this.birthObj.day = '01'
      this.birthClick.monthClick = false
      this.birthClick.dayClick = false
    },
    theDayClick (key) {
      this.birthObj.day = key
      this.birthClick.dayClick = false
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
    validationAgree () {
      if (!this.serviceAgree || !this.privateAgree || !this.adultAgree) {
        this.error = {
          agree: true
        }
        return false
      }
      this.error = {
        agree: ''
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
        if (!this.validationAgree()) return false
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
          birthday: this.birthObj.year + this.birthObj.month + this.birthObj.day
        }).then(async (response) => {
          this.$store.dispatch('authentication/sendMailCode', {
            email: this.email,
            uri: `${location.protocol}//${location.host}/member/join/complete`
          }).then((response) => {
            this.$router.push({
              path: '/member/join/sendEmail',
              query: {
                email: this.email
              }
            })
          })
        })
      })
    },
    clickAgreeAll () {
      if (this.agreeAll) {
        this.serviceAgree = true
        this.privateAgree = true
        this.marketAgree = true
      } else {
        this.serviceAgree = false
        this.privateAgree = false
        this.marketAgree = false
      }
    },
    clickServiceAgree () {
      // this.serviceAgree = !this.serviceAgree
      this.$nextTick(() => {
        this.initAllAgree()
      })
    },
    clickPrivateAgree () {
      // this.privateAgree = !this.privateAgree
      this.$nextTick(() => {
        this.initAllAgree()
      })
    },
    clickMarketAgree () {
      // this.marketAgree = !this.marketAgree
      this.$nextTick(() => {
        this.initAllAgree()
      })
    },
    initAllAgree () {
      if (this.serviceAgree && this.privateAgree && this.marketAgree) {
        this.agreeAll = true
      } else {
        this.agreeAll = false
      }
    },
    openTermService () {
      this.$emit('openTermService')
    },
    openTermPrivate () {
      this.$emit('openTermPrivate')
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
  }
}
</script>
