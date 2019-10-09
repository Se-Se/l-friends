<template>
  <div>
    <main-wrapper v-if="status">
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <min-height-content>
          <member-title :title="$t('member.joinComplate.title')" />
          <member-item />
          <div class="join-complate">
            <figure class="join-complate__fig">
              <img src="~@/assets/images/pc/member/join-complate-bg.jpg">
            </figure>
            <div class="join-complate__content">
              <p class="join-complate__content-title">
                <span>{{ memberId }}</span><br>
                {{ $t('common.sir')}} {{ $t('common.welcome')}} {{ $t('common.hi')}}
              </p>
            </div>
            <div class="join-complate__footer">
              <default-button :data="form.home" @click="goHome" />
            </div>
          </div>
        </min-height-content>
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import cookies from 'js-cookie'

import LayoutWidth from '../../layout/common/LayoutWidth'
import FooterWrap from '../../layout/footer/Footer'
import MainWrapper from '../../layout/common/MainWrapper'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import DefaultButton from '../../assets/buttons/DefaultButton'

import MemberTitle from '../../member/MemberTitle'
import MemberItem from '../../member/MemberItem'
import MinHeightContent from '../../layout/common/MinHeightContent'

import JoinComplete from '@/components/mixins/member/JoinComplete'

export default {
  name: 'JoinComplete',
  components: {
    FooterWrap,
    LayoutWidth,
    MainWrapper,
    BreadCrumbs,
    MemberItem,
    MemberTitle,
    DefaultButton,
    MinHeightContent
  },
  mixins: [JoinComplete]
}
</script>
