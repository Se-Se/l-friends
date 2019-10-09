<template>
  <div class="part">
    <h2>1：1 お問い合わせ履歴</h2>
    <div class="con_area">
      <ul v-if="inquiries && totalCount>0 ">
        <li v-for="(item,index) in inquiries.slice(0, 3)" :key="index" @click.prevent="$router.push('/mypage/inquiry')" style="cursor: pointer;">
          <dl>
            <dt>
              <p class="name">{{ item.inquiryType.inquiryTypeName }}
                <span v-if="item.inquiryStatus  === 'ASKED'" class="badge badge_gray">未回答</span>
                <span v-if="item.inquiryStatus  === 'ANSWERED'" class="badge badge_green">回答済み</span>
              </p>
            </dt>
            <dd>
              <p class="ellipsis">{{item.inquiryTitle | toHtml}}</p>
            </dd>
          </dl>
        </li>
      </ul>
      <p v-if="(!inquiries || totalCount<1) && !pending.inquiries" class="no_info">作成した１：１お問い合わせがありません。</p>
      <p class="more">
        <a href="#" @click.prevent="$router.push('/mypage/inquiry')">もっと見る</a>
      </p>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState('profileinquiry', ['inquiries', 'totalCount', 'pending'])
  }
}
</script>
