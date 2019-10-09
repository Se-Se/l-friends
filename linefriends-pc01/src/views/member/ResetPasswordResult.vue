<template>
  <div id="container" class="login">
    <div class="email-wrapper" style="display: block;">
      <div class="email-password">
        <div class="login-wrapper">
          <h2>パスワード再設定</h2>
          <ul class="input_list">
            <li>
              <div class="input_text"><input type="password" placeholder="8文字以上/英文字、数字、記号を含む" v-model="password" @blur="validationCheck" maxlength="20" :class="error.password ? 'error' : ''"></div>
              <p v-if="error.password" class="error-info">{{error.password}}</p>
            </li>
            <li>
              <div class="input_text">
                <input type="password" placeholder="パスワードをもう一度入力" v-model="passwordConfirm" @blur="validationCheckConfirm" @keypress.enter="editPasswordAction" maxlength="20" :class="error.passwordConfirm ? 'error' : ''">
              </div>
              <p v-if="error.passwordConfirm" class="error-info">{{error.passwordConfirm}}</p>
            </li>
          </ul>
          <button class="btn btn_green mar-top-32" @click.prevent="editPasswordAction">次へ</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { joinPasswordValidation } from '@/utils/validateUtils'

export default {
  data () {
    return {
      password: '',
      passwordConfirm: '',
      error: {}
    }
  },
  methods: {
    editPasswordAction () {
      if (this.validationCheck() && this.validationCheckConfirm()) {
        this.$store.dispatch('profile/certificatedByEmail', {
          certificationNumber: this.$route.query.cn,
          memberId: this.$route.query.email,
          newPassword: this.password
        }).then((response) => {
          this.$router.push({ path: '/member/find/password/success' })
        })
      }
    },
    validationCheck () {
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
          // password: validationResult.pattern + '포함하여 입력해주세요.'
          password: 'パスワードは' + validationResult.pattern + 'を含めて入力してください。'
        }
        return false
      }
      this.error = {}
      return true
    },
    validationCheckConfirm () {
      if (!this.passwordConfirm) {
        this.error = {
          passwordConfirm: 'パスワードをもう一度入力してください。'
        }
        return false
      }

      if (this.password !== this.passwordConfirm) {
        this.error = {
          passwordConfirm: '同じパスワードを入力してください。'
        }
        return false
      }
      this.error = {}
      return true
    }
  },
  mounted () {
    if (this.$route.query.cn) {
      this.$store.dispatch('authentication/passwordMailCode', {
        email: this.$route.query.email,
        cn: this.$route.query.cn
      }).then((response) => {
        console.log(response)
      })
    }
  }
}

</script>
