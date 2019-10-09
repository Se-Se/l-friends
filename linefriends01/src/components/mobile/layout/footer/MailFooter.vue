<template>
  <footer class="footer">
    <p>
      본 메일은 발신전용입니다. 메일 관련 궁금한 점이 있으시면
      <a
        href="#"
        class="footer-link"
      >고객센터</a>를 이용해주세요
    </p>
    <p class="footer-info">
      <span class="footer-info__company">{{ mallInfo.companyName }}</span>
      <span class="footer-info__email">{{ mallInfo.representEmail }}</span>
      <span class="footer-info__contact">{{ mallInfo.representPhoneNo }}</span>
      <span class="footer-info__address"><address>{{ mallInfo.address + ' ' + mallInfo.addressDetail }}</address></span>
    </p>
    <p class="footer-copyright">
      Copyright ⓒ LINE FRIENDS Corp. All Rights Reserved.
    </p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      mallInfo: {
        companyName: '라인프렌즈',
        businessRegistrationNo: '726-87-00030',
        onlineMarketingBusinessDeclarationNo: '2017-서울용산-0174',
        representativeName: '김성훈',
        address: '서울시 용산구 이태원로 200',
        addressDetail: '라인프렌즈 5F',
        representEmail: 'customercare@linefriends.com',
        representPhoneNo: '1544-5921'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  height: 16.8rem;
  padding: 2rem 2rem 4rem;
  font-family: 'Noto Sans KR';
  font-weight: normal;
  font-size: 1.2rem;
  letter-spacing: -0.01rem;
  line-height: 1.5;
  color: #999;
  background: #f6f6f6;

  &-link {
    color: #4ba4d9;
    text-decoration: underline;
  }

  &-info {
    display: flex;
    flex-wrap: wrap;

    > *:not(:last-child)::after {
      content: '';
      display: inline-block;
      margin: 0.2rem 0.9rem 0 0.6rem;
      width: 1px;
      height: 1rem;
      background: #ddd;
    }
  }

  &-copyright {
    margin-top: 1.8rem;
  }
}
</style>
