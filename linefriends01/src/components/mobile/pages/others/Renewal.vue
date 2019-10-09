<template>
  <div class="wrapper">
    <div class="content_area">
      <div class="content_box">
        <div class="test">
          <h1 class="title">
            <a href="#" class="logo"><span class="blind">Line Friends</span></a>
            <span class="text">온라인 스토어 리뉴얼 안내</span>
          </h1>
          <div class="notice_box">
            <strong class="notice_title"><span>서비스 중단 일시</span>2019년 6월 29일 0시 - 2019년 7월 1일 오전 9시</strong>
            <p class="text">안녕하세요. 라인프렌즈입니다.<br>고객님들께 더욱 새로운 모습을 선보이고자,<br>전체적인 리뉴얼로 인해 온라인 스토어 운영이 잠시 중단됩니다. </p>
            <p class="text">사이트 이용에 불편을 드려 죄송합니다.<br>고객님들의 너그러운 마음으로 양해부탁드립니다.<br>온라인 스토어 리뉴얼 후 새로운 모습으로 찾아 뵙도록 하겠습니다. </p>
            <p class="text">감사합니다.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="image_area">
      <span class="image"><img src="~@/assets/images/mobile/m_brown.png" alt="브라운이미지" width="100%" height="100%"></span>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'

export default {
  name: 'Renewal',
  beforeRouteLeave (to, from, next) {
    $('html').attr('id', '')
    next()
  },
  mounted () {
    $('html').attr('id', 'line-friends-renewal')
  }
}
</script>
<style lang="scss">
html#line-friends-renewal {
  height:100%!important;

  /* Common */
  body,p,h1,h2,h3,h4,h5,h6,ul,ol,li,dl,dt,dd,table,th,td,form,fieldset,legend,input,textarea,button,select {
    margin:0;
    padding:0
  }
  body,input,textarea,select,button,table {
    font-size:14px
  }
  body {
    position:relative!important;
    height:100%!important;
    font-family: AppleSDGothicNeo-Regular,NanumBarunGothic,'나눔바른고딕',Malgun Gothic,'맑은 고딕',sans-serif;
    -webkit-text-size-adjust:none;
    color:#000
  }
  img,fieldset {
    border:none
  }
  ul,ol {
    list-style:none
  }
  em,address {
    font-style:normal;
    word-break:break-all
  }
  #wrap {
    height:100%
  }
  a {
    color:#000;
    text-decoration:none
  }
  .blind {
    visibility:hidden;
    overflow:hidden;
    position:absolute;
    top:0;
    left:0;
    width:1px;
    height:1px;
    text-indent:-10000px
  }
  table {
    border-collapse:collapse
  }
  input,button,select,textarea {
    outline:none
  }
  textarea{resize:none}
  ::-webkit-input-placeholder{color:#ccc}

  @font-face {
    font-family: 'NanumBarunGothic';
    src: url(/static/fonts/NanumBarunGothicWeb.eot);
    src: url(/static/fonts/NanumBarunGothicWeb.eot?#iefix) format("embedded-opentype"),url(/static/fonts/NanumBarunGothicWeb.woff) format("woff"),url(/static/fonts/NanumBarunGothicWeb.ttf) format("truetype")
  }

  .wrapper {
    position: relative;
    min-height:100%;
    min-width:320px;
    padding-bottom: 210px;
    background-color: #fff;
    font-size: 0;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .content_area {
    position: relative;
    padding: 0 20px 10px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  @media screen and (min-height: 667px) {
    .wrapper {
      height: 100%;
    }
    .content_area {
      height: 100%;
      min-height: 100%;
    }

    .content_box {
      position: relative;
      height: 100%;
    }

    .content_box .test {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width:100%;
    }
  }

  .title {
    padding-top: 33px;
  }

  .title .logo {
    display: block;
    width: 170px;
    height: 20px;
    background: url('~@/assets/images/pc/pc_logo.png') no-repeat 0 0;
    background: url('~@/assets/images/mobile/m_logo.png') no-repeat;
    background-size: 170px 20px;
    -webkit-background-size: 170px 20px;
  }

  .title .text {
    display: block;
    margin-top: 9px;
    font-size: 16px;
    letter-spacing: -0.08px;
    line-height: 1.2;
    color: #333;
    font-weight: bold;
  }

  .notice_box {
    margin-top: 14px;
    border-top: 1px solid #868686;
  }

  .notice_box .notice_title {
    display: block;
    font-weight: bold;
    margin-bottom: 6px;
    padding: 14px 0 10px;
    font-size: 12px;
    color: #333;
    letter-spacing: -0.07px;
    line-height: 20px;
    border-bottom: 1px solid #ddd;
  }

  .notice_box .notice_title span {
    display: block;
  }

  .notice_box .text {
    padding-top: 10px;
    font-size: 12px;
    line-height: 22px;
    letter-spacing: -0.09px;
    color: #333;
  }

  .image_area {
    position: absolute;
    bottom:0;
    width: 100%;
    text-align: center;
  }

  .image_area .image {
    display: inline-block;
    text-align: center;
    width: 316px;
    height: 210px;
  }

  @media (max-width: 320px) {
    .wrapper{
      padding-bottom: 166px;
    }
    .image_area .image {
      width: 250px;
      height: 166px;
    }
  }
}
</style>
