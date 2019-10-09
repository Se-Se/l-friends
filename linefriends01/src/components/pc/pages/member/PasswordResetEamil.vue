<template>
  <section
    style="
      width:100%;
      height:100%;
      background-color:#f6f6f6;"
  >
    <div
      style="
        width:680px;
        height:auto;
        margin:0 auto;
        text-align:center;
        background-color:#ffffff;"
    >
      <header
        style="
          width:100%;
          height:auto;
          padding:22px 0;
          border-bottom:1px solid #eeeeee;"
      >
        <figure
          style="
            width:141px;
            height:18px;
            margin:0 auto;"
        >
          <img
            src="~@/assets/images/common/logo.svg"
            alt="Line Friends"
            title="Line Friends"
            style="width:100%;"
          >
        </figure>
      </header>
      <div style="padding-top:80px;">
        <h2
          style="
            font-family:'Noto Sans KR';
            font-size:20px;
            font-weight:bold;
            line-height:1.4;
            letter-spacing:-0.1px;
            color:#333333;"
        >
          비밀번호 재설정
        </h2>
        <figure
          style="
            width:172px;
            padding-top:32px;
            margin:0 auto;"
        >
          <img
            src="~@/assets/images/pc/icons/ic-join-setting.png"
            alt="Line Friends"
            title="Line Friends"
            style="width:100%;"
          >
        </figure>
        <div
          style="
            padding-top:24px;"
        >
          <p
            style="
              font-family: 'Noto Sans KR';
              font-size:16px;
              font-weight:normal;
              line-height:1.5;
              letter-spacing:-0.1px;
              color:#333333;"
          >
            <span
              style="
                display:inline-block;
                max-width:240px;
                font-family:Volte, sans-serif;
                font-size:20px;
                font-weight:600;
                color:#00d664;"
            >
              gh.back@dnd-lab.comgh.back@dnd-lab.comgh.back@dnd-lab.comgh.back@dnd-lab.comgh.back@dnd-lab.comgh.back@dnd-lab.com
              <span
                style="
                  font-family: 'Noto Sans KR';
                  font-size: 16px;
                  font-weight: normal;
                  line-height: 1.5;
                  letter-spacing: -0.1px;
                  color:#333333;
                "
              >님</span>
            </span>
            <br>
            비밀번호 재설정이 요청되었습니다.<br>
            아래 링크에서 새 비밀번호를 등록하세요.
          </p>
        </div>
        <div style="padding-top:40px;">
          <a
            href="#"
            style="
              display:inline-block;
              width:280px;
              height:52px;
              font-family: 'Noto Sans KR';
              font-size:16px;
              font-weight:bold;
              line-height:3;
              background-color:#00d644;
              border-radius:3px;
              color:#ffffff;"
          >비밀번호 재설정 하기</a>
        </div>
        <div
          style="
            padding:20px 0 80px;"
        >
          <p
            style="
              font-family: 'Noto Sans KR';
              font-size:12px;
              font-weight:normal;
              line-height:1.5;
              letter-spacing:-0.1px;
              color:#999999;"
          >
            링크는 24시간 동안 비밀번호 재설정까지만 유효합니다.<br>
            비밀번호 재설정 요청을 하지 않은 경우<br>
            본 이메일을 무시해주세요.<br>
            어떠한 변경 사항도 적용되지 않습니다.
          </p>
        </div>
      </div>
      <footer
        style="
          width:100%;
          padding:19px 0 40px 19px;
          font-family:'Noto Sans KR';
          font-size:12px;
          font-weight:normal;
          text-align:left;
          line-height:1.8;
          color:#999999;
          background-color:#f6f6f6;"
      >
        <p>
          본 메일은 발신전용입니다. 메일 관련 궁금한 점이 있으시면
          <a
            href="#"
            style="color:#4ba4d9; text-decoration: underline;"
          >고객센터</a>
          를 이용해주세요
        </p>
        <p>
          <span>라인프렌즈</span>
          <span
            style="
              color: #ddd;
              margin: 0 3px;"
          >|</span>
          <span>customercare@linefriends.com</span>
          <span
            style="
              color: #ddd;
              margin: 0 3px;"
          >|</span>
          <span>1544-5921</span>
          <span
            style="
              color: #ddd;
              margin: 0 3px;"
          >|</span>
          <span>서울시 용산구 이태원 200</span>
        </p>
        <p style="padding-top:22px;">Copyright ⓒ LINE FRIENDS Corp. All Rights Reserved.</p>
      </footer>
    </div>
  </section>
</template>
<script>
export default {
  name: 'PasswordResetEmail'
}
</script>
