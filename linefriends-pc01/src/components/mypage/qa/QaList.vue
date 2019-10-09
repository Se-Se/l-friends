<template>
  <div class="qa_area">
    <div class="table_wrap">
      <table class="table_data">
        <colgroup>
          <col style="width: 16%;">
          <col style="width: 21%;">
          <col style="width: 37%;">
          <col style="width: 15%;">
          <col style="width: 10%;">
        </colgroup>
        <thead>
          <tr>
            <th>カテゴリー</th>
            <th>商品名</th>
            <th>内容</th>
            <th>登録日</th>
            <th>ステータス</th>
          </tr>
        </thead>
        <tbody class="have_none" v-for="(item,index) in qaList" :key="index">
          <tr @click.prevent="clickQa(index)">
            <th class="qa-th-font_500">{{ getInquiryType(item.type) }}</th>
            <th class="qa_area_text_left">
              <p class="ellipsis qa_name">{{ item.productName }}</p>
            </th>
            <th class="qa_area_text_left">
              <p class="ellipsis qa_con">{{item.content | toHtml}}</p>
            </th>
            <th class="qa-th-font_color_999">{{ item.registerYmdt | dateFormatStr('yyyy-MM-dd hh:mm') }}</th>
            <th v-if="item.answers === null" class="qa-th-font_500 qa-th-font_color_ababab">未回答</th>
            <th v-else class="green_font qa-th-font_bold">回答済み</th>
          </tr>
          <tr :class="qaIndex===index ? '' : 'qa_area_have'">
            <td colspan="5">
              <div class="qa_area_expansion">
                <div class="qa_area_expansion_content have_border">
                  <p>
                    <span>Q</span>商品についてのお問い合わせ
                  </p>
                  <ul>
                    <li>
                      <MoreView :MoreViewIsOpen="MoreViewIsOpen" :content="item.content" />
                    </li>
                    <li v-if="item.answers === null" class="amendment_deletion">
                      <button @click.prevent="updateQa(item.type,item.inquiryNo,item.content)">修正</button>
                      <button @click.prevent="deleteQa(item.inquiryNo)">削除</button>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="qa_area_expansion" v-for="(answer,index) in item.answers" :key="index">
                <div class="qa_area_expansion_content">
                  <p class="green_font">
                    <span>A</span>
                    {{answer.adminType === 'SERVICE'?'LINE FRIENDSからのご回答':'ご回答'}}
                  </p>
                  <ul>
                    <li>
                       <MoreView :MoreViewIsOpen="MoreViewIsOpen" :content="answer.content" />
                    </li>
                    <li class="qa_1_data">{{ answer.updateYmdt | dateFormatStr('yyyy-MM-dd hh:mm') }}</li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- ↓↓↓↓↓ popup ↓↓↓↓↓ -->
    <qa-popup v-if="qadata" :qadata="qadata" @closeQaPopup="closeQaPopup" :style="isOpen ? 'display:block;' : 'display:none;'" />
    <!-- ↑↑↑↑↑ popup ↑↑↑↑↑ -->
  </div>
</template>
<script>
import MoreView from '@/components/common/MoreView.vue'
import { mapActions, mapGetters } from 'vuex'
import { Alert, Confirm } from '@/components/common/modal'
import QaPopup from '@/components/mypage/qa/QaPopup'
import { toHtml } from '@/utils/utils'
export default {
  data () {
    return {
      qaIndex: -1,
      isOpen: false,
      qadata: null,
      MoreViewIsOpen: false
    }
  },
  props: ['qaList'],
  components: {
    QaPopup,
    MoreView
  },
  computed: {
    ...mapGetters('common', ['productInquiryTypes'])
  },
  methods: {
    ...mapActions('mypage', ['delQa']),
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
    },
    clickQa (index) {
      // console.log(index, this.qaIndex)
      this.MoreViewIsOpen = !this.MoreViewIsOpen
      if (this.qaIndex === index) {
        this.qaIndex = -1
      } else {
        this.qaIndex = index
      }
    },
    deleteQa (inquiryNo) {
      Confirm('お問い合わせを削除しますか？').then((res) => {
        if (res) {
          console.info('click yes')
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
    updateQa (type, inquiryNo, content) {
      if (type) {
        this.qadata = {
          type: type,
          inquiryNo: inquiryNo,
          content: toHtml(content)
        }
        this.$store.commit('SHOW_POP')
        this.isOpen = true
      }
    },
    closeQaPopup () {
      this.$store.commit('CLOSE_POP')
      this.isOpen = false
      this.qadata = null
    }
  }
}
</script>
