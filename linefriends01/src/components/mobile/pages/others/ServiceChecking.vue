<template>
  <div>
    <logo-header />
    <div class="service-error">
      <h2 class="service-error__title">
        현재 서비스 점검중입니다.
      </h2>
      <figure class="service-error__fig">
        <img
          src="~@/assets/images/mobile/ic-nodata-brown.png"
          alt="LineFriends"
        >
      </figure>
      <div class="service-error__info">
        <p>보다 좋은 서비스를 제공해드리기 위해<br>서비스 점검중에 있습니다.<br>빠른 시간 내에 정상적인 이용 가능하도록<br>최선을 다하겠습니다.</p>
      </div>
      <div class="service-error__checking-guide">
        <dl>
          <dt>시스템 점검 시간</dt>
          <dd>2019년 06월 05(수) 오전 0시~<br>2019년 6월 05(수) 오전 6시 까지</dd>
        </dl>
        <dl>
          <dt>시스템 점검 내용</dt>
          <dd>시스템 업그레이드 점검 작업</dd>
        </dl>
        <dl>
          <dt>고객센터</dt>
          <dd>1544-5921</dd>
        </dl>
        <dl>
          <dt>문의메일</dt>
          <dd>customercare@linefriends.com</dd>
        </dl>
      </div>
    </div>
    <copyright-footer />
  </div>
</template>
<script>
import LogoHeader from '@/components/mobile/layout/header/LogoHeader'
import CopyrightFooter from '@/components/mobile/layout/footer/CopyrightFooter'

export default {
  name: 'ServiceError',
  components: {
    LogoHeader,
    CopyrightFooter
  }
}
</script>
