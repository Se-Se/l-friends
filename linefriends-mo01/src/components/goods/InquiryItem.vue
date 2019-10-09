<template>
  <li class="open" @click="$emit('click')">
    <dl class="info">
      <dt class="inquiry">
        <strong v-if="inquiry"> {{ getTypeName(inquiry.type) }}</strong>
        <MoreViewInquiry ref="inquiryView" :stop="true"  :content="inquiry.content" />
      </dt>
      <dd>
        <span class="mail" v-if="inquiry.nickName">{{inquiry.nickName.substring(0,2) + '***'}}</span>
        <span class="date">{{ inquiry.registerYmdt }}</span>
      </dd>
    </dl>
    <p class="reply">
      <span class="badge badge_green2" v-if="inquiry.answers">回答済み</span>
      <span class="badge badge_gray2" v-else>未回答</span>
    </p>
    <ul class="btn_ctl" v-if="inquiry.myInquiry && !inquiry.answers">
      <li>
        <button class="btn btn_primary size_xs" @click="toEdit(inquiry.inquiryNo)">修正</button>
      </li>
      <li>
        <button class="btn btn_primary size_xs" @click="deleteInquiry(inquiry.inquiryNo)">削除</button>
      </li>
    </ul>
    <transition-expand :group="inquiry.answers.length >1 ?true:false" v-if="inquiry.answers">
      <template v-if="active">
        <div class="talk" v-for="(item, key) in inquiry.answers" :key="key">
          <dl>
            <dt>
              <span class="head"><img src="@/assets/img/character/ic_brown.png" alt=""></span>
              <span>LINE FRIENDSからのご回答</span>
            </dt>
            <dd>
              <p>
                <!-- <pre>{{item.content}}</pre> -->
                <MoreViewInquiry ref="inquiryView" :stop="true" :content="item.content" :isRichText="true" />
              </p>
            </dd>
          </dl>
          <p class="date style-volte">{{item.registerYmdt}}</p>
        </div>
      </template>
    </transition-expand>
  </li>
</template>

<script>
import TransitionExpand from '@/components/common/TransitionExpand'
import { mapState, mapActions } from 'vuex'
import { Alert, Confirm } from '@/components/common/modal'
import MoreViewInquiry from '@/components/common/MoreView.vue'
// import $ from 'jquery'
export default {
  name: 'InquiryItem',
  components: {
    TransitionExpand,
    MoreViewInquiry
  },
  props: {
    inquiry: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isActive: false,
      btnShow: false

    }
  },
  mounted () {
  },
  computed: {
    ...mapState('common', ['malls']),
    inquiryStatus () {
      return this.statuses[this.inquiry.inquiryStatus]
    },
    $route () {
      return this.$router.currentRoute
    },
    page () {
      return this.$route.params.page || 1
    }
  },
  methods: {
    ...mapActions('product', ['fetchProduct']),
    ...mapActions('productinquiry', ['fetchProductInquiry', 'deleteProductInquiry']),
    getTypeName (type) {
      return this.malls.productInquiryType.filter(item => item.value === type)[0].label
    },
    toEdit (inquiryNo) {
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.$router.push({
        name: 'GoodsInquiryDetail',
        params: {
          goodsNo: this.$route.params.goodsNo,
          inquiryNo
        },
        query: {
          currScroll,
          from: 'GoodsInquiry'
        }
      })
    },
    async deleteInquiry (inquiryNo) {
      Confirm({ message: 'お問い合わせを削除しますか？' }).then((res) => {
        if (res) {
          this.deleteProductInquiry({
            inquiryNo: inquiryNo,
            page: this.page,
            productNo: this.$route.params.goodsNo
          }).then(() => {
            Alert({ message: '削除されました。' }).then(() => {
              this.fetchProduct({ productTheNo: this.$route.params.goodsNo }).then(() => {
              })
              this.$emit('goToInquiry')
            })
          })
        }
      }).catch(() => {
        let data = {
          productNo: this.$route.params.goodsNo,
          pageNo: 1
        }
        this.fetchProductInquiry(data)
      })
    }
  }
}
</script>

<style scoped>
.open {
  transition: all 0.3s;
}
pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.talk {
  transition: all 0.3s;
}
.expand-enter,
.expand-leave-to {
  opacity: 0;
}
</style>
