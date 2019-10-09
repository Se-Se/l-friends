<template>
  <div class="item_detail_contents">
    <div class="item_detail_data">
      <template v-if="inquiryList && inquiryList.totalCount > 0">
        <div class="bx_sort">
          <h3 class="item_detail_title" v-if="inquiryList ">商品お問い合わせ<span class="wrapper-pc-font_family_c" v-if="inquiryList">{{ inquiryList.totalCount>99 ? '99+' : inquiryList.totalCount }}</span>
            <span class="btn_r"><button class="btn btn_primary size_m" @click="layerViews('contactAdd')">お問い合わせする</button></span>
          </h3>
          <p class="item_detail_title_link"><a href="#" @click.prevent="CheckLoginToQa">非公開はこちら</a></p>
        </div>
        <ul class="item_qa_list">
          <li :class="{'on': contact.modifiable === true && opened.includes(key),'for_show_more':true}" v-for="(contact, key) in inquiryList.item" :key="`${contact.inquiryNo}_${key}`" @click="toggle(key)">
            <div :class="{'item_quesstion':true}">{{ getTypeName(contact.type) }}
              <template v-if="contact.answers">
                <span class="badge badge_green">回答済み</span>
              </template>
              <template v-else>
                <span class="badge badge_gray">未回答</span>
              </template>
            </div>
            <p class="item_quesstion_contents">
              <pre>{{contact.content | toHtml}}</pre>
            </p>
            <button type="button" class="btn_detail" v-if="showMoreBtn(key)" @click.stop="showMoreContent(key)">
              <span class="txt">続きを読む</span>
            </button>
            <div class="member_data">
              <span class="email">{{ contact.nickName.length == 1 ? contact.nickName.substring(0,1) + '****' : contact.nickName.substring(0,2) + '***' }}</span>
              <span class="date"> {{ contact.registerYmdt }}</span>
              <div class="btn_group" v-if="!contact.answers && contact.myInquiry">
                <span><button class="btn btn_primary size_s" @click="layerViews('modifyview', contact)">修正</button></span>
                <span><button class="btn btn_primary size_s" @click="deleteInquiry(contact.inquiryNo)">削除</button></span>
              </div>
            </div>
            <template v-if="contact.answers && opened.includes(key)">
              <div class="item_answer" style="display:block" v-for="( answer, key ) in contact.answers" :key="key">
                <div class="head_icon">
                  <p class="itemview_name">LINE FRIENDSからのご回答</p>
                </div>
                <div class="item_answer_contents">
                  <div class="anwwer_text">
                    <show-more-view :MoreViewIsOpen="MoreViewIsOpen" :stop="true" :content="answer.content" />
                  </div>
                  <span class="date"> {{ contact.updateYmdt }}</span>
                </div>
              </div>
            </template>

          </li>
        </ul>
      </template>
      <template v-else>
        <div class="item_detail_nodata" style="display: block;">
          <img src="@/assets/img/common/img_error.png" alt="">
          <p class="text">商品に関するお問い合わせがございません。</p>
          <button class="btn btn_primary size_m" @click="layerViews('contactAdd')">お問い合わせする<i class="ico_infor"></i></button>
          <p class="faq_link"><a href="#" @click.prevent="CheckLoginToQa">非公開はこちら</a></p>
        </div>
      </template>
    </div>
    <template v-if="inquiryList && inquiryList.totalCount > 0 ">
      <pagination v-model="page" :total="inquiryList.totalCount" :limit="20" :qaFlag="false" @input="moveToPage" />
    </template>
    <qa-layer-popup ref="layerPop" :visible="layerPopupStatus" type="normal" :theInquiryNo="theInquiry" :data="malls.productInquiryType" :title="'商品お問い合わせ変更'" @close="closePoup" />
  </div>
</template>
<script>
import QaLayerPopup from '@/components/common/QaLayerPopup'
import Pagination from '@/components/common/Pagination'
import { mapState, mapActions } from 'vuex'
import { Alert, Confirm } from '@/components/common/modal'
import { isLogin, toHtml } from '@/utils/utils'
import $ from 'jquery'
import ShowMoreView from '@/components/goods/ShowMoreView.vue'
export default {
  name: 'DetailContact',
  components: {
    Pagination,
    QaLayerPopup,
    ShowMoreView
  },
  props: {
    pageDefault: {
      type: Number
    }
  },
  created () {
    this.initContact()
  },
  data () {
    return {
      opened: [],
      modify: false,
      bgActive: false,
      layerPopupStatus: null,
      visible: '',
      page: this.$router.currentRoute.params.page || 1,
      theInquiry: 0,
      theShowMore: [],
      MoreViewIsOpen: false
    }
  },
  computed: {
    ...mapState('productinquiry', ['inquiryList', 'inquiry']),
    ...mapState('common', ['malls']),
    goodsNo () {
      return this.$router.currentRoute.params.goodsNo
    },
    $route () {
      return this.$router.currentRoute
    },
    inquiryNo () {
      return this.$route.params.inquiryNo
    },
    isEdit () {
      return this.layerPopupStatus === 'modifyView'
    },
    title () {
      return '商品に関するお問い合わせ ' + (this.isEdit ? '修正' : '登録')
    },
    initType () {
      return ''
    }
  },
  mounted () {
    // this.showMoreContentBtn()
  },
  methods: {
    ...mapActions('productinquiry', [
      'fetchProductInquiry',
      'fetchProductInquiryDetail',
      'postProductInquiry',
      'putProductInquiry',
      'deleteProductInquiry']
    ),
    showMoreContentBtn (key) {
      if ($('.item_quesstion_contents')[0]) {
        this.$nextTick(() => {
          let thePre = document.getElementsByClassName('item_quesstion_contents')
          let newThePre = []
          newThePre = [...thePre]
          let arr = []
          arr = newThePre.map((item, index) => {
            if (item.offsetHeight > $('.item_quesstion').height() * 3.3) {
              return index
            }
          })
          this.theShowMore = arr
          $('.item_quesstion_contents').addClass('hold_show_more')
        })
      }
    },
    showMoreBtn (key) {
      return this.theShowMore.indexOf(key) > -1
    },
    showMoreContent (key) {
      let thePre = document.getElementsByClassName('item_quesstion_contents')
      if (thePre[key].classList[1] === 'hold_show_more') {
        thePre[key].classList.remove('hold_show_more')
        $('.for_show_more')[key].childNodes[2].childNodes[0].innerHTML = '閉じる'
      } else {
        thePre[key].classList.add('hold_show_more')
        $('.for_show_more')[key].childNodes[2].childNodes[0].innerHTML = '続きを読む'
      }
    },
    initContact () {
      this.moveToPage(this.pageDefault)
    },
    CheckLoginToQa () {
      if (isLogin()) {
        this.$router.push('/etc/inquiry')
      } else {
        this.$router.push({
          path: '/member/login',
          query: {
            redirect: '/etc/inquiry'
          }
        })
      }
    },
    toggle (id) {
      this.MoreViewIsOpen = !this.MoreViewIsOpen
      const index = this.opened.indexOf(id)
      if (index > -1) {
        this.opened.splice(index, 1)
        this.modify = false
        this.bgActive = false
        this.MoreViewIsOpen = false
      } else {
        this.opened = []
        this.opened.push(id)
        this.bgActive = true
      }
    },
    layerViews (event, inquiry) {
      if (!isLogin()) {
        this.$router.push({
          path: '/member/login',
          query: {
            redirect: this.$route.path
          }
        })
      } else {
        this.layerPopupStatus = event
        $('html').css('overflow', 'hidden')
        if (inquiry) {
          inquiry.content = toHtml(inquiry.content)
          this.theInquiry = inquiry
          // inquiry.secreted = true
          this.layerPopupStatus = 'modifyView'
        } else {
          this.$refs.layerPop.addNew()
          this.layerPopupStatus = 'contactAdd'
        }
      }
    },
    reviewPopAction () {
      this.eventBus.$emit('openPopup')
    },
    getTypeName (type) {
      return this.malls.productInquiryType.filter(item => item.value === type)[0].label
    },
    deleteInquiry (inquiryNo) {
      Confirm({ message: 'お問い合わせを削除しますか？' }).then((res) => {
        if (res) {
          this.deleteProductInquiry({
            inquiryNo: inquiryNo,
            page: this.page,
            productNo: this.$route.params.goodsNo
          }).then(() => {
            Alert({
              message: '削除されました。'
            })
          })
          this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page }).then(() => {
            this.$nextTick(() => {
              setTimeout(() => {
                this.showMoreContentBtn()
              }, 1000)
            })
          })
        }
      })
    },
    closePoup () {
      $('html').css('overflow', 'scroll')
      this.showMoreContentBtn()
      this.layerPopupStatus = null
    },
    moveToPage (num) {
      this.fetchProductInquiry({ productNo: this.$route.params.goodsNo, pageNo: num }).then(() => {
        let top = $('.wrap').offset().top + $('.wrap').height() - 40 - $('.wrap_tabmenu').height()
        $('html, body').animate({ scrollTop: top })
        this.$nextTick(() => {
          this.showMoreContentBtn()
        })
      })
    }
  }
}
</script>
<style  scoped>
.detail-default__item {
  cursor: default !important;
}
.wrapper-pc .itemview .item_qa_list .member_data .btn_group {
  display: block;
}
.txt_select {
  width: 100%;
  height: 100%;
  list-style: none;
  position: absolute;
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}
pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.hold_show_more {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  max-height: 78px;
}
.wrapper-pc .itemview .item_qa_list .btn_detail {
  display: inline-block;
  margin-top: 12px;
  font-size: 0;
  padding-bottom: 11px;
}
.item_qa_list .btn_detail .txt {
  display: inline-block;
  font-size: 14px;
  color: #4ba4d9;
  font-weight: 500;
  vertical-align: middle;
  text-decoration: underline;
}
</style>
