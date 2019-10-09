<template>
  <div id="container" class="mypage">
    <!-- order detial -->
    <div class="wrap">

      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <BreadCrumbs :breadCrumbs="'マイページ'"></BreadCrumbs>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

      <!-- ↓↓↓↓↓ mypage-content ↓↓↓↓↓ -->
      <div class="mypage-content">
        <h1>マイページ</h1>
        <div class="main">
          <section class="section_area welcome cf">
            <div class="name">
              <dl>
                <dt><span class="workers" v-if="isExec">社員</span>ようこそ。</dt>
                <dd>
                  <p>{{profile && profile.nickname}}<span>様</span></p>
                </dd>
              </dl>
              <p class="btn_info">
                <button class="btn_radius" @click.prevent="toProfile">情報を変更する</button>
              </p>
            </div>
            <div class="have cf">
              <dl class="coupon">
                <dt>クーポン</dt>
                <dd @click.prevent="$router.push('/mypage/cupon')" style="cursor: pointer;">{{mySummary && mySummary.usableCouponCnt}}</dd>
              </dl>
              <dl class="collection">
                <dt>お気に入り</dt>
                <dd @click.prevent="$router.push('/mypage/like')" style="cursor: pointer;">
                  <template v-if="mySummary && mySummary.likeCnt <= 99">
                    {{mySummary && mySummary.likeCnt}}
                  </template>
                  <template v-else>
                    99<span>+</span>
                  </template>
                </dd>
              </dl>
            </div>
          </section>
          <section class="section_area summary">
            <h2>注文履歴</h2>
            <div class="con_area cf">
              <ul class="step cf">
                <li>
                  <div>
                    <span class="icon"></span>
                    <p class="txt_con">
                      <span class="item_name">入金待ち</span>
                      <strong class="data">{{depositWaitCnt}}</strong>
                    </p>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="icon"></span>
                    <p class="txt_con">
                      <span class="item_name">注文完了</span>
                      <strong class="data">{{payDoneCnt}}</strong>
                    </p>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="icon"></span>
                    <p class="txt_con">
                      <span class="item_name">配送準備中</span>
                      <strong class="data">{{deliveryPrepareCnt}}</strong>
                    </p>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="icon"></span>
                    <p class="txt_con">
                      <span class="item_name">配達完了</span>
                      <strong class="data">
                        <template v-if="deliveryDoneCnt <= 99">
                          {{deliveryDoneCnt}}
                        </template>
                        <template v-else>
                          99<span>+</span>
                        </template>
                      </strong>
                    </p>
                  </div>
                </li>
              </ul>
              <div class="other">
                <dl @click.prevent="$router.push('/mypage/cancellist')" style="cursor: pointer;">
                  <dt>キャンセル</dt>
                  <dd>{{mySummary && mySummary.orderCountByStatus && (mySummary.orderCountByStatus.cancelDoneCnt + mySummary.orderCountByStatus.cancelProcessingCnt) || 0}}</dd>
                </dl>
                <!-- <dl>
                  <dt>交換</dt>
                  <dd>{{mySummary && mySummary.orderCountByStatus && (mySummary.orderCountByStatus.exchangeDoneCnt + mySummary.orderCountByStatus.exchangeProcessingCnt) || 0}}</dd>
                </dl> -->
                <dl @click.prevent="$router.push('/mypage/cancellist')" style="cursor: pointer;">
                  <dt>返品</dt>
                  <dd>{{mySummary && mySummary.orderCountByStatus && (mySummary.orderCountByStatus.returnDoneCnt + mySummary.orderCountByStatus.returnProcessingCnt) || 0}}</dd>
                </dl>
              </div>
            </div>
            <p class="more">
              <router-link to="/mypage/orderlist">もっと見る</router-link>
            </p>
          </section>
          <!-- ReviewPart -->
          <review-part />
          <!-- ReviewPart -->
          <section class="section_area cf">
            <!-- QaPart -->
            <qa-part />
            <!-- QaPart -->
            <!-- InquiriePart -->
            <inquirie-part />
            <!-- InquiriePart -->
          </section>
        </div>
      </div>
      <!-- ↑↑↑↑↑ mypage-content ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->

  </div>
</template>

<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'
import { mapState, mapGetters } from 'vuex'
import QaPart from '@/components/mypage/QaPart'
import InquiriePart from '@/components/mypage/InquiriePart'
import ReviewPart from '@/components/mypage/ReviewPart'

export default {
  components: {
    BreadCrumbs,
    QaPart,
    InquiriePart,
    ReviewPart
  },
  computed: {
    ...mapState('member', ['mySummary']),
    ...mapState('profile', ['profile']),
    ...mapGetters('profile', ['isExec']),
    depositWaitCnt () {
      let cnt = 0
      if (this.mySummary && this.mySummary.orderCountByStatus) {
        cnt = this.mySummary.orderCountByStatus.depositWaitCnt
      }
      return cnt
    },
    payDoneCnt () {
      let cnt = 0
      if (this.mySummary && this.mySummary.orderCountByStatus) {
        cnt = this.mySummary.orderCountByStatus.payDoneCnt + this.mySummary.orderCountByStatus.productPrepareCnt
      }
      return cnt
    },
    deliveryPrepareCnt () {
      let cnt = 0
      if (this.mySummary && this.mySummary.orderCountByStatus) {
        cnt = this.mySummary.orderCountByStatus.deliveryPrepareCnt + this.mySummary.orderCountByStatus.deliveryIngCnt
      }
      return cnt
    },
    deliveryDoneCnt () {
      let cnt = 0
      if (this.mySummary && this.mySummary.orderCountByStatus) {
        cnt = this.mySummary.orderCountByStatus.deliveryDoneCnt + this.mySummary.orderCountByStatus.buyConfirmCnt
      }
      return cnt
    }
  },
  methods: {
    toProfile () {
      this.$router.push('/mypage/profile')
    }
  }
}
</script>
