<template>
  <div id="container" class="mypage">
    <Breadcrumb :title="'マイページ'"></Breadcrumb>

    <!-- ↓↓↓↓↓ mypage_wrapper ↓↓↓↓↓ -->
    <div class="mypage_wrapper">
      <div class="main">
        <div class="welcome">
          <div class="name">
            <dl>
              <dt><span class="workers" v-if="isExec">社員</span>ようこそ。</dt>
              <dd>
                <p><strong class="name_con">{{profile && profile.nickname}}</strong><span>様</span></p>
              </dd>
            </dl>
          </div>
          <p class="btn_info">
            <button class="btn_radius" @click.prevent="toProfile">情報を変更する</button>
          </p>
          <div class="have cf">
            <dl class="coupon" @click.prevent="$router.push('/m/mypage/cupon')">
              <dt>
                <span class="icon"></span>
                クーポン
              </dt>
              <dd>{{mySummary && mySummary.usableCouponCnt}}</dd>
            </dl>
            <dl class="collection" @click.prevent="$router.push('/m/mypage/like')">
              <dt>
                <span class="icon"></span>
                お気に入り
              </dt>
              <dd>
                <template v-if="mySummary && mySummary.likeCnt <= 99">
                  {{mySummary && mySummary.likeCnt}}
                </template>
                <template v-else>
                  99<span>+</span>
                </template>
              </dd>
            </dl>
          </div>
        </div>
        <div class="menu_list">
          <ul>
            <li>
              <a @click.prevent="$router.push('/m/mypage/orderlist')">
                <p class="name">注文履歴</p>
                <span class="data"><template v-if="orderCount <= 99">
                    {{orderCount}}
                  </template>
                  <template v-else>
                    99+
                  </template>
                </span>
              </a>
            </li>
            <li>
              <a @click.prevent="$router.push('/m/mypage/cancellist')">
                <p class="name">キャンセル・返品</p>
                <!-- <p class="name">交換・返品</p> -->
                <span class="data">{{processingCnt}}</span>
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="$router.push('/m/mypage/myreview')">
                <p class="name">レビュー履歴</p>
                <span class="data">{{mySummary && mySummary.reviewCnt}}</span>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="#" @click.prevent="$router.push('/m/mypage/qa')">
                <p class="name">商品お問い合わせ履歴</p>
                <span class="data">{{totalCount}}</span>
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="$router.push('/m/mypage/inquiry')">
                <p class="name">1：1 お問い合わせ履歴</p>
                <span class="data">{{mySummary && mySummary.inquiries && mySummary.inquiries.totalCount}}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- ↑↑↑↑↑ mypage_wrapper ↑↑↑↑↑ -->

  </div>
</template>
<script>
import Breadcrumb from '@/components/common/Breadcrumb'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'MyPage',
  components: {
    Breadcrumb
  },
  computed: {
    ...mapState('member', ['mySummary']),
    ...mapState('profile', ['profile']),
    ...mapState('productinquiry', ['totalCount']),
    ...mapGetters('profile', ['isExec']),
    orderCount () {
      return (this.mySummary && this.mySummary.orderCountByStatus && (this.mySummary.orderCountByStatus.productPrepareCnt + this.mySummary.orderCountByStatus.payDoneCnt + this.mySummary.orderCountByStatus.deliveryIngCnt + this.mySummary.orderCountByStatus.deliveryPrepareCnt + this.mySummary.orderCountByStatus.deliveryDoneCnt + this.mySummary.orderCountByStatus.buyConfirmCnt)) || 0
    },
    processingCnt () {
      return (this.mySummary && this.mySummary.orderCountByStatus && (this.mySummary.orderCountByStatus.cancelDoneCnt + this.mySummary.orderCountByStatus.cancelProcessingCnt + this.mySummary.orderCountByStatus.exchangeDoneCnt + this.mySummary.orderCountByStatus.exchangeProcessingCnt + this.mySummary.orderCountByStatus.returnDoneCnt + this.mySummary.orderCountByStatus.returnProcessingCnt)) || 0
    }
  },
  methods: {
    toProfile () {
      this.$router.push('/m/mypage/profile')
    }
  }
}
</script>
