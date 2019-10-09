<template>
  <div class="my-info">
    <main-wrapper :main="true">
      <layout-width>
        <my-info-table
          :title="$t('mypage.profile.subjectPasswordConfirm')"
          :memberId="memberId"
          mode="passwordConfirm"
          ref="infotable"
          @action="action"
        />

        <div class="my-info__btn">
          <default-btn :data="btn.cancel" @click="goHome"/>
          <default-btn :data="btn.submit" @click="action"/>
        </div>
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import LayoutWidth from '../../layout/common/LayoutWidth'
import MainWrapper from '../../layout/common/MainWrapper'
import MainTitle from '../../mypage/MainTitle'
import Status from '../../mypage/Status'
import MyInfoTable from '../../mypage/MyInfoTable'
import WhiteBtn from '../../assets/buttons/WhiteButton'
import DefaultBtn from '../../assets/buttons/DefaultButton'

import PasswordConfirm from '@/components/mixins/mypage/PasswordConfirm'

export default {
  name: 'passwordConfirm',
  mixins: [PasswordConfirm],
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
      btn: {
        cancel: {
          action: 'button',
          to: '',
          title: this.$t('button.cancel'),
          type: 'half',
          active: false
        },
        submit: {
          action: 'button',
          to: '',
          title: this.$t('button.ok'),
          type: 'half',
          active: true
        }
      }
    }
  },
  methods: {
    action () {
      this.authProfile(this.$refs.infotable.authPassword)
    }
  }
}
</script>
