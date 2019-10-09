<template>
  <div class="qa_wrapper">
    <ul class="qa_list qa_border_bottom qa_qa">
      <li v-for="(item,index) in qaList" :key="index">
        <div class="qa_item" @click.prevent="clickQa(index)">
          <div class="qa_list-header">
            <p class="name_font_500">{{ getInquiryType(item.type) }}</p>
            <p v-if="item.answers === null" class="status">未回答</p>
            <p v-else class="status font-green">回答済み</p>
          </div>
          <div class="qa_list-body">
            <p class="item">{{ item.productName }}</p>
            <MoreView :content="item.content" :stop="true" />
            <p class="date">{{ formatData(item.registerYmdt) }}</p>
          </div>
          <ul class="btn-list" v-if="item.answers === null">
            <li><button class="btn btn_primary size_xs" @click.prevent="toEdit(item.productNo,item.inquiryNo)">修正</button></li>
            <li><button class="btn btn_primary size_xs" @click.prevent="deleteQa(item.inquiryNo)">削除</button></li>
          </ul>
        </div>
        <div class="comments-list" :style="qaIndex===index ? 'display:block;' : 'display:none;'" v-if="item.answers !== null">
          <div class="input-a_new ans_sp" v-for="(answer,idx) in item.answers" :key="idx">
            <p class="qa_title qa_a-title">
              <span class="write_green_a">A</span>
              {{answer.adminType === 'SERVICE'?'LINE FRIENDSからのご回答':'ご回答'}}
            </p>
            <p class="txt-con">
              <span class="txt">
                <MoreView :content="answer.content" :MoreViewIsOpen="qaIndex===index" />
              </span>
              <span class="date">{{ formatData(answer.updateYmdt) }}</span>
            </p>
          </div>
        </div>
      </li>
    </ul>
    <mugen-scroll :handler="pageDown" :should-handle="showMugen && !pending.qaList" :offsetTop="-3000">
      <div id="loader" v-show="showMugen">
        <div class="loader_img"></div>
      </div>
    </mugen-scroll>
  </div>
</template>
<script>
import MoreView from '@//components/common/MoreView.vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { Alert, Confirm } from '@/components/common/modal'
import MugenScroll from '@/components/common/MugenScroll'
import { dateFormatStrContainIOS } from '@/utils/dateUtils'

export default {
  data () {
    return {
      qaIndex: -1,
      isOpen: false,
      qadata: null
    }
  },
  props: [],
  components: {
    MugenScroll,
    MoreView
  },
  computed: {
    ...mapGetters('common', ['productInquiryTypes']),
    ...mapState('mypage', ['qaList', 'totalCount', 'currentPage', 'currentPageSize', 'pending']),
    showMugen () {
      return this.qaList && this.qaList.length < this.totalCount
    }
  },
  methods: {
    ...mapActions('mypage', ['delQa']),
    pageDown () {
      this.$store.dispatch('mypage/fetchQaMore')
    },
    getInquiryType (type) {
      let lable = '商品お問い合わせ'
      if (this.productInquiryTypes) {
        this.productInquiryTypes.forEach(item => {
          if (item.value === type) {
            lable = item.label
          }
        })
      }
      return lable
    },
    clickQa (index) {
      if (this.qaIndex === index) {
        this.qaIndex = -1
      } else {
        this.qaIndex = index
      }
    },
    deleteQa (inquiryNo) {
      Confirm('お問い合わせを削除しますか？').then((res) => {
        if (res) {
          this.ConfirmDelQa(inquiryNo)
        }
      })
    },
    async ConfirmDelQa (inquiryNo) {
      let ret = await this.delQa(inquiryNo)
      if (ret) {
        Alert({ message: '削除されました。' }).then(() => {
          this.qaIndex = -1
        })
      }
    },
    formatData (str) {
      return dateFormatStrContainIOS(str, 'yyyy-MM-dd hh:mm')
    },
    toEdit (productNo, inquiryNo) {
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.$router.push({
        name: 'GoodsInquiryDetail',
        params: {
          goodsNo: productNo,
          inquiryNo
        },
        query: {
          currScroll,
          from: 'Order'
        }
      })
    }
  }
}
</script>
