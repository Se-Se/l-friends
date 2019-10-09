<template>
  <div>
    <main-wrapper>
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <main-title :title="$t('user.menu.mypage')" />
        <status />
        <menu-wrap
          :mode="$route.name"
          :child="$route.meta.commonName"
        />
        <router-view></router-view>
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import LayoutWidth from '../../layout/common/LayoutWidth'
import MainWrapper from '../../layout/common/MainWrapper'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import MenuWrap from '../../mypage/MenuWrap'
import MainTitle from '../../mypage/MainTitle'
import Status from '../../mypage/Status'

export default {
  name: 'MyPage',
  components: {
    LayoutWidth,
    MainWrapper,
    BreadCrumbs,
    MenuWrap,
    MainTitle,
    Status
  },
  data () {
    return {
      basicCrumbs: '홈'
    }
  },
  created () {
    this.$store.dispatch('member/mySummary')
    this.$store.dispatch('member/getWelfareTotal')
  }
}
</script>
