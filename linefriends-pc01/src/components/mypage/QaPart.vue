<template>
  <div class="part">
    <h2>商品お問い合わせ履歴</h2>
    <div class="con_area">
      <ul v-if="qaList && totalCount>0 ">
        <li v-for="(item,index) in qaList.slice(0, 3)" :key="index" @click.prevent="$router.push('/mypage/qa')" style="cursor: pointer;">
          <dl>
            <dt>
              <p class="name">{{ getInquiryType(item.type) }}
                <span v-if="item.answers === null" class="badge badge_gray">未回答</span>
                <span v-else class="badge badge_green">回答済み</span>
              </p>
            </dt>
            <dd>
              <p class="ellipsis">{{item.content | toHtml}}</p>
            </dd>
          </dl>
        </li>
      </ul>
      <p v-if="(!qaList || totalCount<1) && !pending.qaList" class="no_info">作成したお問い合わせがありません。</p>
      <p class="more">
        <a href="#" @click.prevent="$router.push('/mypage/qa')">もっと見る</a>
      </p>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState('mypage', ['qaList', 'totalCount', 'pending']),
    ...mapGetters('common', ['productInquiryTypes'])
  },
  methods: {
    getInquiryType (type) {
      let lable = '商品お問い合わせ'
      if (this.productInquiryTypes) {
        this.productInquiryTypes.forEach(item => {
          // console.log(item.value, lable)
          if (item.value === type) {
            lable = item.label
          }
        })
      }
      return lable
    }
  }
}
</script>
