<template>
  <div class="wrap">
    <!-- [D] 컨테이너 // 마이페이지인 경우 : #container에 main 클래스 추가 -->
    <div id="container" class="etc_warning">
      <div class="etc_inner">
        <div class="con_1">
          <span class="ico_ti sp">warning</span>
          <h1>요청하신 페이지를 찾을 수 없습니다.</h1>
          <p class="txt_1 mar-top-20">주소를 잘못입력하였거나, 요청하신 페이지가 변경되었습니다.<br> 입력하신 주소가 정확한지 다시 확인해주시기 바랍니다.<br> 이벤트 페이지의 경우, 이벤트 종료 후 페이지가 삭제될 수 있습니다.</p>
          <ul class="btn_area">
            <li>
              <button class="btn btn_gray" @click.prevent="goBack">이전페이지</button>
            </li>
            <li>
              <button class="btn btn_red" @click.prevent="goHome">홈으로 가기</button>
            </li>
          </ul>
        </div>

      </div>
    </div>
    <!-- // [D] 컨테이너 -->
  </div>
</template>

<script>
export default {
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
