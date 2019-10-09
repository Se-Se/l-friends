<template>
  <div>
    <member-header-wrap/>
    <div class="service-error__title">
      <error-title title="요청하신 페이지를 찾을 수 없습니다." /> 
    </div>
    <div class="service-error__contents">
      <member-layout>
        <figure class="service-error__fig">
          <img
            src="~@/assets/images/pc/icons/ic-nodata-brown.png"
            alt="Line Friends"
            title="Line Friends"
          >
        </figure>
        <p class="service-error__info">
          주소를 잘못입력하였거나, 요청하신 페이지가 변경되었습니다.<br>
          입력하신 주소가 정확한지 다시 확인해주시기 바랍니다.<br>
          프로모션 페이지의 경우, 프로모션 종료 후 페이지가 삭제될 수 있습니다.
        </p>
        <div class="service-error__button">
          <div class="service-error__button--before">
            <order-button type="mypage" @click="goBack">
              이전 페이지
            </order-button>
          </div>
          <div class="service-error__button--main">
            <order-button type="home" @click="goHome">
              메인으로 돌아가기
            </order-button>
          </div>
        </div>
      </member-layout>
      <member-footer/>
    </div>
  </div>
</template>
<script>
import MemberHeaderWrap from '../../layout/header/EmailHeader'
import ErrorTitle from '../../member/MemberTitle'
import MemberLayout from '../../member/MemberLayout'
import MemberFooter from '../../member/MemberFooter'
import OrderButton from '../../order/OrderButton'

export default {
  name: 'SeviceError',
  components: {
    MemberHeaderWrap,
    ErrorTitle,
    MemberLayout,
    OrderButton,
    MemberFooter
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
