<template>
  <div class="wrapper">
    <div class="content_area">
      <h1 class="title">
        <a href="#" class="logo"><span class="blind">Line Friends</span></a>
        <span class="text">온라인 스토어 리뉴얼 안내</span>
      </h1>
      <div class="notice_box">
        <strong class="notice_title">서비스 중단 일시: 2019년 6월 29일 0시 - 2019년 7월 1일 오전 9시</strong>
        <p class="text">안녕하세요. 라인프렌즈입니다.<br>고객님들께 더욱 새로운 모습을 선보이고자,<br>전체적인 리뉴얼로 인해 온라인 스토어 운영이 잠시 중단됩니다. </p>
        <p class="text">사이트 이용에 불편을 드려 죄송합니다.<br>고객님들의 너그러운 마음으로 양해부탁드립니다.<br>온라인 스토어 리뉴얼 후 새로운 모습으로 찾아 뵙도록 하겠습니다. </p>
        <p class="text">감사합니다.</p>
      </div>
    </div>
    <div class="image_box">
      <span class="image"><img src="~@/assets/images/pc/pc_brown.png" alt="브라운이미지" width="552" height="409"></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Renewal'
}
</script>
<style scoped>
  article,aside,audio,body,button,canvas,dd,details,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,input,legend,li,menu,nav,ol,p,section,table,td,textarea,th,ul,video {
    margin: 0;
    padding: 0
  }

  i {
    font-family: AppleSDGothicNeo-Regular,NanumBarunGothic,'나눔바른고딕',Malgun Gothic,'맑은 고딕',sans-serif;
    font-weight: normal !important;
  }

  body,button,code,input,select,table,textarea {
    font-family: AppleSDGothicNeo-Regular,NanumBarunGothic,'나눔바른고딕',Malgun Gothic,'맑은 고딕',sans-serif;
    font-size: 16px;
    line-height: 20px
  }

  html,body {
    width: 100%;
    height: 100%
  }

  body {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
  }

  fieldset,img {
    border: 0
  }

  img {
    vertical-align: top
  }

  ol,ul {
    list-style: none
  }

  address,cite,dfn,em,i {
    font-style: normal
  }

  textarea {
    border: 1px solid #bcbcbc;
    resize: none
  }

  a {
    color: inherit;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0.1)
  }

  table {
    border-collapse: collapse
  }

  table caption {
    overflow: hidden !important;
    position: static;
    clip: rect(0 0 0 0) !important;
    width: 1px !important;
    height: 1px !important;
    margin: -1px !important
  }

  .blind {
    overflow: hidden !important;
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    margin: -1px !important;
    clip: rect(0 0 0 0) !important
  }
  @font-face {
    font-family: 'NanumBarunGothic';
    src: url(/static/fonts/NanumBarunGothicWeb.eot);
    src: url(/static/fonts/NanumBarunGothicWeb.eot?#iefix) format("embedded-opentype"),url(/static/fonts/NanumBarunGothicWeb.woff) format("woff"),url(/static/fonts/NanumBarunGothicWeb.ttf) format("truetype")
  }
  .wrapper {
    position: relative;
    min-width: 1240px;
    height: 100%;
    background-color: #fff;
  }

  .content_area {
    position: relative;
    height: 100%;
    min-height: 1086px;
    margin: 0 auto;
    text-align: center;
  }

  .title {
    padding-top: 140px;
  }

  .title .logo {
    display: block;
    margin: 0 auto;
    width: 240px;
    height: 30px;
    background: url('~@/assets/images/pc/pc_logo.png') no-repeat 0 0;
    background-size: 240px 30px;
    -webkit-background-size: 240px 30px;
  }

  .title .text {
    font-family: AppleSDGothicNeo-Regular,NanumBarunGothic,'나눔바른고딕',Malgun Gothic,'맑은 고딕',sans-serif;
    display: block;
    margin-top: 7px;
    font-size: 24px;
    letter-spacing: -0.11px;
    line-height: 30px;
    color: #333;
    font-weight: bold;
    text-align: center;
  }

  .notice_box {
    width: 460px;
    margin: 22px auto 0;
    padding-bottom: 24px;
    border-top: 1px solid #868686;
    border-bottom: 1px solid #868686;
  }

  .notice_box .notice_title {
    font-family: AppleSDGothicNeo-Regular,NanumBarunGothic,'나눔바른고딕',Malgun Gothic,'맑은 고딕',sans-serif;
    font-weight: bold;
    display: block;
    margin-bottom: 4px;
    padding: 15px 0 13px;
    font-size: 14px;
    color: #333;
    letter-spacing: -0.1px;
    line-height: 24px;
    border-bottom: 1px solid #ddd;
  }

  .notice_box .text {
    font-family: AppleSDGothicNeo-Regular,NanumBarunGothic,'나눔바른고딕',Malgun Gothic,'맑은 고딕',sans-serif;
    padding-top: 14px;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: -0.1px;
    color: #333;
  }

  .image_box {
    position: relative;
  }

  .image_box .image {
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -278px;
    display: block;
    width: 552px;
    height: 409px;
  }
</style>
