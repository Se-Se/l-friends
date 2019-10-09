<template>
  <div class="my-info">
    <main-wrapper :main="true">
      <layout-width>
        <my-info-table
          :title="$t('mypage.profile.subject')"
          :memberId="memberId"
          :memberName="memberName"
          :notify="notify.email"
          :name="name"
          @connect="snsConnect"
          @setData="setValue"
          @setNotify="setNotify"
        />
        <div class="my-info__footer">
          <p class="my-info__footer-title">
            {{ $t('mypage.profile.description.hack') }}
          </p>
          <white-btn
            :data="form.hack"
          />
        </div>
        <div class="my-info__btn">
          <default-btn :data="btn.submit" @click="editProfile"/>
        </div>
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import Vue from 'vue'
import LayoutWidth from '../../layout/common/LayoutWidth'
import MainWrapper from '../../layout/common/MainWrapper'
import MainTitle from '../../mypage/MainTitle'
import Status from '../../mypage/Status'
import MyInfoTable from '../../mypage/MyInfoTable'
import WhiteBtn from '../../assets/buttons/WhiteButton'
import DefaultBtn from '../../assets/buttons/DefaultButton'

import Profile from '@/components/mixins/mypage/Profile'

export default {
  name: 'Profile',
  mixins: [Profile],
  components: {
    LayoutWidth,
    MainWrapper,
    MainTitle,
    Status,
    MyInfoTable,
    WhiteBtn,
    DefaultBtn
  },
  data () {
    return {
      email: '',
      error: {},
      form: {
        hack: {
          action: 'link',
          to: '/mypage/hack',
          title: this.$t('mypage.profile.button.hack'),
          type: 'short'
        }
      },
      btn: {
        submit: {
          action: 'button',
          to: '/mypage/orderlist',
          title: this.$t('button.ok'),
          type: 'free',
          size: 360,
          active: false
        }
      }
    }
  },
  methods: {
    setNotify (value) {
      Vue.set(this.notify, 'email', value)
    },
    setValue (set) {
      Vue.set(this.$data, set.type, set.value)
    }
  }
}
</script>
