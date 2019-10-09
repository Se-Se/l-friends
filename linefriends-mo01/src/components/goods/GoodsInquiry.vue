<template>
  <div class="detail_wrapper">
    <div v-if="inquiryList && inquiryList.totalCount > 0">
      <div class="btn_write_area no_line">
        <app-button size="middle-small" @click="scrollHistory" v-if="product && product.baseInfo">
          お問い合わせする
        </app-button>
      </div>
      <div class="link_blue">
        <a href="#" @click.prevent="CheckLoginToQa">非公開はこちら</a>
      </div>
      <div class="evaluate">
        <ul ref="goodsInquireList" v-if="inquiryList">
          <inquiry-item  v-for="(item, index) in inquiryList.item" :key="index" :inquiry="item" :active="active === item.inquiryNo" @click="setActive(item.inquiryNo)" @goToInquiry="$emit('goToInquiry')" />
        </ul>
        <template v-if="inquiryList">
          <mugen-scroll :handler="qaList" :should-handle="showMugen && !pending.inquiryList">
            <div id="loader" v-show="showMugen">
              <div class="loader_img"></div>
            </div>
          </mugen-scroll>
          <!-- <pagination v-model="page" :total="inquiryList.totalCount" :limit="5" class="mt-24" @change="fetchList" /> -->
        </template>
      </div>
    </div>
    <template v-else>
      <div class="info_area">
        <div class="info_qa_contents">
          <dl class="qa_empty_ctn">
            <dt class="img_qa_empty"><img src="@/assets/img/common/img_error.png" alt=""></dt>
            <dd class="txt_qa_empty">商品に関するお問い合わせがございません。</dd>
          </dl>
          <ul class="qa_empty_btns">
            <li><button class="btn btn_question" @click="handleCheckLogin">お問い合わせする</button></li>
            <li><a href="#" class="txt_question" @click.prevent="CheckLoginToQa">非公開はこちら</a></li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import AppButton from '@/components/goods/button/Button'
import InquiryItem from '@/components/goods/InquiryItem'
import { mapState, mapGetters, mapActions } from 'vuex'
import { isLogin } from '@/utils/utils'
import MugenScroll from '@/components/common/MugenScroll'
export default {
  name: 'GoodsInquiry',
  components: {
    AppButton,
    InquiryItem,
    MugenScroll
  },
  data () {
    return {
      page: this.$router.currentRoute.params.page || 1,
      active: -1,
      items: []
    }
  },
  computed: {
    ...mapGetters('product', ['product']),
    ...mapState('productinquiry', ['inquiryList', 'pending']),
    ...mapState('common', ['malls']),
    goodsNo () {
      return this.$route.params.goodsNo
    },
    showMugen () {
      return this.inquiryList && this.inquiryList.item && this.inquiryList.item.length < this.inquiryList.totalCount
    }
  },
  watch: {

  },
  mounted () {

  },
  methods: {
    ...mapActions('productinquiry', ['fetchProductInquiry']),
    qaList () {
      let maxPage = Math.ceil(this.inquiryList.totalCount / 5)
      if (this.page >= maxPage) {
        return false
      } else {
        this.page = this.page + 1
        let size = this.page * 5
        this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: 1, pageSize: size })
      }
    },
    CheckLoginToQa () {
      if (isLogin()) {
        this.$router.push('/m/etc/inquiry')
      } else {
        this.$router.push({
          path: '/m/member/login',
          query: {
            redirect: '/m/etc/inquiry'
          }
        })
      }
    },
    handleCheckLogin () {
      if (isLogin()) {
        this.$router.push({ name: 'GoodsInquiryDetail', params: { goodsNo: this.product.baseInfo.productNo }, query: { from: 'GoodsInquiry' } })
      } else {
        this.$router.push({
          path: '/m/member/login',
          query: {
            redirect: this.$route.path
          }
        })
      }
    },
    init () {
      this.page = 1
      this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page, pageSize: 5 })
    },
    fetchList (num) {
      const goodsNode = this.$refs.goodsInquireList.childNodes
      if (goodsNode.length) {
        this.$refs.goodsInquireList.style.height = goodsNode[0].offsetHeight * this.items.length + 'px'
      }
      this.inquiryList.item = []
      setTimeout(() => {
        this.inquiryList.item = this.items
      }, 1)
      this.page = num
      this.active = -1
      this.$emit('update')
      this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page })
    },
    setActive (inquiryNo) {
      let tempItem = this.inquiryList.item.find(item => item.inquiryNo === inquiryNo)
      if (tempItem && tempItem.answers) {
        this.active = this.active === inquiryNo ? -1 : inquiryNo
      }
    },
    getTypeName (type) {
      return this.malls.productInquiryType.filter(item => item.value === type)[0].label
    },
    scrollHistory () {
      this.handleCheckLogin()
      this.$route.query.currScroll = window.scrollY
    }
  }
}
</script>
