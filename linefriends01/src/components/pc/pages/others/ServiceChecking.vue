<template>
  <div>
    <member-header-wrap />
    <div class="service-checking__title">
      <checked-title title="현재 서비스 점검중 입니다." /> 
    </div>
    <div class="service-checking__contents">
      <member-layout>
        <figure class="service-checking__fig">
          <img
            src="~@/assets/images/pc/icons/ic-nodata-brown.png"
            alt="Line Friends"
            title="Line Friends"
          >
        </figure>
        <p class="service-checking__info">
          보다 좋은 서비스를 제공해드리기 위해 서비스 점검 중에 있습니다.<br>
          빠른 시간 내에 정상적인 이용 가능하도록 최선을 다하겠습니다.
        </p>
        <div class="service-checking__guide">
          <dl class="service-checking__guide--list">
            <dt class="service-checking__guide--title">
              시스템 점검 시간
            </dt>
            <dd class="service-checking__guide--info">
              2019년 06월 05(수) ~<br>2019년 06월 05(수) 오전 6시까지
            </dd>
          </dl>
          <dl class="service-checking__guide--list">
            <dt class="service-checking__guide--title">
              시스템 점검 내용
            </dt>
            <dd class="service-checking__guide--info">
              시스템 업그레이드 점검 작업
            </dd>
          </dl>
          <dl class="service-checking__guide--list">
            <dt class="service-checking__guide--title">
              고객센터
            </dt>
            <dd class="service-checking__guide--info">
              1544 - 5921
            </dd>
          </dl>
          <dl class="service-checking__guide--list">
            <dt class="service-checking__guide--title">
              문의메일
            </dt>
            <dd class="service-checking__guide--info">
              customercare@linefriends.com
            </dd>
          </dl>
        </div>
      </member-layout>
    </div>
    <member-footer />
  </div>
</template>
<script>
import MemberHeaderWrap from '@/components/pc/layout/header/EmailHeader'
import checkedTitle from '@/components/pc/member/MemberTitle'
import MemberLayout from '@/components/pc/member/MemberLayout'
import MemberFooter from '@/components/pc/member/MemberFooter'

export default {
  name: 'ServiceChecking',
  components: {
    MemberHeaderWrap,
    checkedTitle,
    MemberLayout,
    MemberFooter
  }
}
</script>
