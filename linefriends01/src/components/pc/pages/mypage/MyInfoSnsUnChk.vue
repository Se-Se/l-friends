<template>
  <div class="my-info">
    <header-wrap />
    <main-wrapper>
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <main-title title="마이페이지" />
        <status
          :name="userName"
          :mypageStatus="mypageStatus"
          :executives="executives"
        />
        <my-info-table />
        <div class="my-info__footer">
          <p class="my-info__footer-title">
            {{ $t('user.hack') }}
          </p>
          <white-btn :data="form.hack" />
        </div>
        <div class="my-info__btn">
          <default-btn :data="btn.submit" />
        </div>
      </layout-width>
    </main-wrapper>
    <footer-wrap />
  </div>
</template>
<script>
import LayoutWidth from '../../layout/common/LayoutWidth'
import HeaderWrap from '../../layout/header/Header'
import FooterWrap from '../../layout/footer/Footer'
import MainWrapper from '../../layout/common/MainWrapper'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import MainTitle from '../../mypage/MainTitle'
import Status from '../../mypage/Status'
import MyInfoTable from '../../mypage/MyInfoTable'
import WhiteBtn from '../../assets/buttons/WhiteButton'
import DefaultBtn from '../../assets/buttons/DefaultButton'

export default {
  name: 'MyinfoSnsUnChk',
  components: {
    FooterWrap,
    HeaderWrap,
    LayoutWidth,
    MainWrapper,
    BreadCrumbs,
    MainTitle,
    Status,
    MyInfoTable,
    WhiteBtn,
    DefaultBtn
  },
  data () {
    return {
      userName: '테스트',
      basicCrumbs: '홈',
      executives: true,
      mypageStatus: [
        {
          idx: 0,
          title: '배송중',
          icon: 'delivery',
          images: 'images/pc/icons/ic-delivery34x23.svg',
          value: 0
        },
        {
          idx: 1,
          title: '쿠폰',
          icon: 'coupon',
          iamges: 'images/pc/icons/ic-coupon24x24.svg',
          value: 0
        },
        {
          idx: 2,
          title: '상품평',
          icon: 'review',
          images: 'images/pc/icons/ic-review27x27.svg',
          value: 1
        },
        {
          idx: 3,
          title: '찜한 상품',
          icon: 'wish',
          images: 'images/pc/icons/ic-wish26x23.svg',
          value: 12
        }
      ],
      form: {
        hack: {
          action: 'button',
          to: '',
          title: '회원탈퇴',
          type: 'short'
        }
      },
      btn: {
        submit: {
          action: 'button',
          to: '',
          title: '확인',
          type: 'free',
          size: 360,
          active: false
        }
      }
    }
  }
}
</script>
