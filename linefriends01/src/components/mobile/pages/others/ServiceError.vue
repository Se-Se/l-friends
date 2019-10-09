<template>
  <div>
    <logo-header />
    <div class="service-error">
      <h2 class="service-error__title">
        요청하신 페이지를 찾을 수 없습니다.
      </h2>
      <figure class="service-error__fig">
        <img
          src="~@/assets/images/mobile/ic-nodata-brown.png"
          alt="LineFriends"
        >
      </figure>
      <div class="service-error__info">
        <p>주소를 잘못 입력하였거나,<br>요청하신 페이지가 변경되었습니다.<br>입력하신 주소가 정확한지<br>다시 확인해주시기 바랍니다.<br><br>이벤트 페이지의 경우,<br>이벤트 종료 후 페이지가 삭제될 수 있습니다.</p>
      </div>
      <div class="service-error__button-list">
        <app-button
          type="secondary"
          bold
          @click="goBack"
        >
          이전 페이지
        </app-button>
        <app-button
          type="success"
          bold
          @click="goHome"
        >
          메인으로 돌아가기
        </app-button>
      </div>
    </div>
    <copyright-footer />
  </div>
</template>
<script>
import LogoHeader from '@/components/mobile/layout/header/LogoHeader'
import AppButton from '@/components/mobile/common/button/Button'
import CopyrightFooter from '@/components/mobile/layout/footer/CopyrightFooter'

export default {
  name: 'ServiceError',
  components: {
    LogoHeader,
    AppButton,
    CopyrightFooter
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>
