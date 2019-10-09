<template>
  <div>
    <sub-page-header
      v-if="$route.name === 'MyPage'"
      :title="$t($route.meta.title)"
    />
    <div
      v-if="$route.name === 'MyPage'"
      id="container"
      class="mypage"
    >
      <user-info class="mypage__block" />

      <order-info class="mypage__block" />

      <div
        v-for="(nav, key) in navs"
        :key="key"
        class="mypage__block mypage-nav__wrapper"
      >
        <ul class="mypage-nav">
          <li
            v-for="(item, ikey) in nav"
            :key="ikey"
            class="mypage-nav__item"
          >
            <router-link
              :to="item.link"
              class="mypage-nav__link"
            >
              <span class="mypage-nav__label">{{ item.label }}</span>
              <span
                v-if="item.count !== ''"
                class="mypage-nav__count"
              >{{ item.count }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-else
      id="container"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import SubPageHeader from '../../layout/header/SubPageHeader'
  import UserInfo from '../../mypage/UserInfo'
  import OrderInfo from '../../mypage/OrderInfo'
  import status from '@/components/mixins/mypage/Status'
  import { mapState } from 'vuex'

  export default {
    name: 'Mypage',
    mixins: [status],
    components: {
      SubPageHeader,
      UserInfo,
      OrderInfo
    },
    computed: {
      ...mapState('profileinquiry', { profileInquiryCount: 'totalCount' }),
      ...mapState('productinquiry', { productInquiryCount: 'totalCount' }),
      navs () {
        let menu = [
          [
            { label: '주문배송', link: '/mypage/orderlist' },
            { label: '취소반품', link: '/mypage/cancelList' },
            { label: '찜한 상품', link: '/mypage/like' }
          ],
          [
            { label: '쿠폰함', link: '/mypage/mycoupon' }
          ],
          [
            { label: '상품평', link: '/mypage/myreview' },
            { label: '상품문의', link: '/mypage/myproductinquires', count: this.productInquiryCount },
            { label: '1:1문의', link: '/mypage/inquiry', count: this.profileInquiryCount }
          ]
        ]

        if (this.isExec) {
          menu[1].unshift({
            label: '임직원 포인트',
            link: '/mypage/welfare'
          })
        }

        return menu
      }
    }
  }
</script>

<style lang="scss" scoped>
  #container.mypage {
    background: #fafafa;
    margin-bottom: 4rem;
  }

  .mypage__block {
    background: #fff;

    &:not(:last-child) {
      margin-bottom: 1.6rem;
    }
  }

  .mypage-nav {
    &__wrapper:last-child {
      border-bottom: 1px solid #ededed;
    }

    &__item {
      padding-top: 1.7rem;
      padding-bottom: 1.9rem;

      &:not(:last-child) {
        border-bottom: 1px solid #ededed;
      }
    }

    &__link {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 0 4.2rem 0 2rem;
      height: 100%;

      &::after {
        content: '';
        position: absolute;
        top: 48%;
        right: 1.2rem;
        transform: translateY(-50%);
        width: 2.4rem;
        height: 2.4rem;
        background-image: url(~@/assets/images/common/mypage/ic-arrow.svg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }

    &__label {
      font-size: 1.4rem;
      font-family: 'Noto Sans KR';
      font-weight: normal;
      line-height: 1.25;
      letter-spacing: -0.01rem;
      color: #333;
    }

    &__count {
      padding-bottom: 0.35rem;
      transform: translateY(0.15rem);
      font-size: 1.6rem;
      font-family: Volte, sans-serif;
      font-weight: 500;
      line-height: 1.11;
      letter-spacing: -0.01rem;
      color: #333;
    }
  }
</style>
