<template>
  <div id="container" class="old_css">
    <div class="mypage">
      <div class="mypage_inner">
      <h1>MY PAGE</h1>
      <div class="summary">
        <dl>
          <dt>
            <span class="org_name">{{memberGroupNames}}</span>
            {{memberGradeName}}</dt>
          <router-link class="menu" to="/mypage/member/setting">
            <dd class="user" v-if="memberName">
              <p>
                <strong>{{ memberName }}</strong>님
                <small>정보수정</small>
              </p>
            </dd>
          </router-link>
        </dl>
        <dl>
          <router-link class="menu" to="/mypage/welfare">
            <dt>사용 가능 {{pointName}}</dt>
            <dd>{{welfareTotal && MyMiliFormat(welfareTotal.totalAvailableAmt)}}</dd>
          </router-link>
        </dl>
        <dl>
          <router-link class="menu" to="/mypage/orderlist">
            <dt>배송중</dt>
            <dd>{{mySummary && mySummary.deliveringCnt}}</dd>
          </router-link>
        </dl>
        <dl>
          <router-link class="menu" to="/mypage/myreview">
            <dt>상품평</dt>
            <dd>{{mySummary && mySummary.reviewCnt}}</dd>
          </router-link>
        </dl>
        <dl>
          <router-link class="menu" to="/mypage/like">
            <dt>찜한상품</dt>
            <dd>{{mySummary && mySummary.likeCnt}}</dd>
          </router-link>
        </dl>
      </div>
      <div class="menu_wrap" v-show="!($route.path.startsWith('/mypage/member/setting') || $route.path.startsWith('/mypage/member/reset') || $route.path.startsWith('/mypage/member/withdrawal'))">
        <ul class="nav_menu">
          <li :class="{ active: $route.path.startsWith('/mypage/orderlist') }">
            <router-link to='/mypage/orderlist'>주문배송</router-link>
          </li>
          <li :class="{ active: $route.path.startsWith('/mypage/cancellist') }">
            <router-link to='/mypage/cancellist'>취소반품</router-link>
          </li>
          <li :class="{ active: $route.path.startsWith('/mypage/mycoupon') || $route.path.startsWith('/mypage/novalidcoupon') }">
            <router-link to='/mypage/mycoupon'>쿠폰함</router-link>
          </li>
          <li :class="{ active: $route.path.startsWith('/mypage/welfare') }">
            <router-link to='/mypage/welfare'>{{pointName}}</router-link>
          </li>
          <li :class="{ active: $route.path.startsWith('/mypage/myreview') }">
            <router-link to='/mypage/myreview'>상품평</router-link>
          </li>
          <li :class="{ active: $route.path.startsWith('/mypage/myproductinquires') }">
            <router-link to='/mypage/myproductinquires'>상품문의</router-link>
          </li>
          <li :class="{ active: $route.meta.tab === 'inquiry' }">
            <router-link to='/mypage/inquiry'>
              <span class="num">1:1</span>문의</router-link>
          </li>
          <li :class="{active: $route.path.startsWith('/mypage/like') }">
            <router-link to='/mypage/like'>찜한상품</router-link>
          </li>
        </ul>
      </div>
      <div  class="menu_wrap tab_wrap"
            v-if="$route.path.startsWith('/mypage/mycoupon') || $route.path.startsWith('/mypage/novalidcoupon')">
        <ul class="tab_list">
          <li :class="{ active: $route.path.startsWith('/mypage/mycoupon') }">
            <router-link to='/mypage/mycoupon'>사용가능</router-link>
          </li>
          <li>•</li>
          <li :class="{ active: $route.path.startsWith('/mypage/novalidcoupon') }">
            <router-link to='/mypage/novalidcoupon'>사용완료/기간만료 쿠폰</router-link>
          </li>
        </ul>
      </div>
      <router-view></router-view>
    </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .bx_mypage_summary {
    margin-bottom: 0;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import cookies from 'js-cookie'
  import { formatCurrency } from '@/utils/StringUtils'

  export default {
    name: 'MyPage',
    computed: {
      ...mapState('member', ['mySummary']),
      ...mapState('myorder', ['welfareTotal', 'pointName']),
      memberName () {
        return cookies.get('memberName')
      },
      memberGradeName () {
        return cookies.get('memberGradeName')
      },
      memberGroupNames () {
        return cookies.get('memberGroupNames')
      }
    },
    methods: {
      MyMiliFormat (num) {
        return formatCurrency(num)
      }
    },
    created () {
      this.$store.dispatch('member/mySummary')
      this.$store.dispatch('myorder/getWelfareTotal')
    }
  }
</script>
