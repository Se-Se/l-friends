<template>
  <div>
      <div
        class="table-list--header"
      >
        <h2
          class="table-list--header__title"
        >
          {{ title }}
        </h2>
      </div>
    <table class="my-info-table">
      <colgroup>
        <col
          style="width: 160px"
          span="1"
        >
        <col
          style="width: 1020px"
          span="1"
        >
      </colgroup>
      <tbody>
        <tr>
          <th>{{ $t('mypage.profile.title.email') }}</th>
          <td>{{ memberId }}</td>
        </tr>
        <tr v-if="mode !== 'passwordConfirm'">
          <th>{{ $t('mypage.profile.title.name') }}</th>
          <td>
            <div class="my-info-table__input">
              <div class="my-info-table__input-item">
                {{ memberName }}
                <input-item :data="input.name" :value="input.name.value" @input="setName" />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th v-if="mode !== 'passwordConfirm'">{{ $t('mypage.profile.title.password') }}</th>
          <th v-else>{{ $t('mypage.profile.title.passwordPasswordConfirm') }}</th>
          <td>
            <div
              v-if="!active"
              class="my-info-table__input"
            >
              <div class="my-info-table__input-item">
                <template v-if="mode === 'passwordConfirm'">
                  <hidden-input type="text" />
                  <input-item :data="input.passwordChk" v-model="authPassword" mode="passwordConfirm" @keyup.enter.native="$emit('action')" />
                </template>
                <template v-else>
                  <input-item :data="input.password" v-model="oldPassword" />
                </template>
              </div>
              <div class="my-info-table__input-item"  v-if="mode !== 'passwordConfirm'">
                <default-btn
                  :data="btn.password"
                  @click="toggleActive()"
                />
              </div>
            </div>
            <div
              v-if="active"
              class="my-info-table__input"
            >
              <div class="my-info-table__input-item">
                <dl class="my-info-table__input-wrapper">
                  <dt class="my-info-table__input-label">
                    {{ $t('mypage.profile.title.oldPassword') }}
                  </dt>
                  <dd class="my-info-table__input-box">
                    <div class="my-info-table__input-box__item">
                      <input-item :data="input.oldPassword" v-model="oldPassword" @blur="validationCheck" />
                    </div>
                    <p class="my-info-table__input-box__item _error">
                      {{ error.oldPassword }}
                    </p>
                  </dd>
                </dl>
                <dl class="my-info-table__input-wrapper">
                  <dt class="my-info-table__input-label">
                    {{ $t('mypage.profile.title.newPassword') }}
                  </dt>
                  <dd class="my-info-table__input-box">
                    <div class="my-info-table__input-box__item">
                      <input-item :data="input.openPassword" v-model="password"  @blur="validationCheck" />
                    </div>
                    <p class="my-info-table__input-box__item _error">
                      {{ error.password }}
                    </p>
                  </dd>
                </dl>
                <dl class="my-info-table__input-wrapper _changebottom">
                  <dt class="my-info-table__input-label _changebottom-label">
                    {{ $t('mypage.profile.title.newPasswordConfirm') }}
                  </dt>
                  <dd class="my-info-table__input-box _changebottom-label">
                    <div class="my-info-table__input-box__item">
                      <input-item :data="input.openPassword" v-model="passwordConfirm"  @blur="validationCheck" />
                    </div>
                    <div class="my-info-table__input-item _changebottom-button">
                      <div class="my-info-table__input-button">
                        <default-btn
                          :data="btn.changePassword"
                          @click="editPasswordAction"
                        />
                      </div>
                      <div class="my-info-table__input-button">
                        <default-btn
                          type="button"
                          :data="btn.cancelPassword"
                          @click="toggleActive()"
                        />
                      </div>
                    </div>
                  </dd>
                </dl>
                <p class="my-info-table__input-box__item _error _interval">
                  {{ error.passwordConfirm }}
                </p>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="mode !== 'passwordConfirm'">
          <th v-if="connectedSns > 0">{{ $t('mypage.profile.title.useSns') }}</th>
          <th v-else>{{ $t('mypage.profile.title.sns') }}</th>
          <td>
            <div class="my-info-table__sns">
              <sns-login
                mode="mypage"
                :data="getConnectSns"
                @connect="snsConnect"
              />
            </div>
          </td>
        </tr>
        <tr  v-if="mode !== 'passwordConfirm'">
          <th>{{ $t('mypage.profile.title.notice') }}</th>
          <td>
            <div class="my-info-table__benefit">
              <switch-item
                type="checkbox"
                title="이메일"
                name="email"
                :value="notify"
                @input="setNotify"
              />
              <information-title :info="benefit"/>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import SwitchItem from '../assets/Switch'
import InputItem from '../assets/Input'
import HiddenInput from '../assets/hiddenInput'
import SnsLogin from '../auth/SNSLogin'
import DefaultBtn from '../assets/buttons/DefaultButton'
import InformationTitle from '@/components/pc/layout/common/InformationTitle'
import PasswordChange from '@/components/mixins/mypage/PasswordChange'

export default {
  name: 'MyInfoTable',
  mixins: [PasswordChange],
  components: {
    SwitchItem,
    InputItem,
    SnsLogin,
    DefaultBtn,
    InformationTitle,
    HiddenInput
  },
  props: ['name', 'mode', 'title', 'memberId', 'memberName', 'notify'],
  data () {
    return {
      active: false,
      oldPassword: '',
      password: '',
      passwordConfirm: '',
      authPassword: '',
      benefit: '회원정보, 구매정보 및 서비스 주요 정책 관련 내용은 수신 동의 여부와 관계없이 발송됩니다.',
      input: {
        name: {
          model: '',
          size: 221,
          height: 52,
          type: 'text',
          interval: false,
          value: this.memberName,
          reChk: true,
          max: 20
        },
        password: {
          model: '',
          title: '',
          type: 'password',
          placeholder: '',
          interval: false,
          reChk: false,
          mode: 'free',
          size: 221,
          height: 52,
          max: 20,
          value: '',
          readonly: true
        },
        passwordChk: {
          model: '',
          title: '',
          type: 'password',
          placeholder: '',
          interval: false,
          reChk: false,
          mode: 'free',
          size: 221,
          height: 52,
          max: 20,
          readonly: false
        },
        oldPassword: {
          model: '',
          title: '',
          type: 'password',
          placeholder: '',
          interval: false,
          reChk: false,
          mode: 'free',
          size: 287,
          height: 52,
          max: 20,
          value: '',
          readonly: false
        },
        openPassword: {
          model: '',
          title: '',
          type: 'password',
          placeholder: this.$t('mypage.profile.placeholder.password'),
          interval: false,
          reChk: false,
          mode: 'free',
          size: 287,
          height: 52,
          max: 20
        }
      },
      btn: {
        password: {
          action: 'button',
          to: '',
          title: '변경',
          type: 'free',
          size: 82,
          active: false,
          color: 'gray',
          height: 52
        },
        changePassword: {
          action: 'button',
          to: '',
          title: '비밀번호 변경',
          type: 'free',
          size: 172,
          active: false,
          height: 52
        },
        cancelPassword: {
          action: 'button',
          to: '',
          title: '취소',
          type: 'free',
          size: 107,
          active: false,
          color: 'gray',
          height: 52
        }
      }
    }
  },
  computed: {
    ...mapGetters('profile', ['getConnectSns']),
    connectedSns () {
      let count = 0
      for (const key in this.getConnectSns) {
        count = count + (this.getConnectSns[key] === 'ing' ? 1 : 0)
      }
      return count
    }
  },
  methods: {
    setNotify (value) {
      this.$emit('setNotify', value)
    },
    snsConnect (sns) {
      this.$emit('connect', sns)
    },
    setName (value) {
      this.input.name.value = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9~!@#$%^&*()_+']/g, '')
      this.input.name = Object.assign({}, this.input.name)
      this.$emit('setData', {
        type: 'name',
        value: this.input.name.value
      })
    },
    toggleActive () {
      if (this.active === true) {
        this.error = {}
        this.password = ''
        this.passwordConfirm = ''
        this.active = false
      } else {
        this.active = true
      }
    }
  }
}
</script>
