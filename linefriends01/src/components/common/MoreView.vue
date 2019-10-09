<template>
  <div>
    <div class="bx_review">
      <p>
        <template v-if="isPCDevice">
          <pre :style="{
              'overflow-y': moreView === false ? 'hidden' : 'hidden',
              'max-height': moreView === false ? 'none' : '66px'
            }">{{content}}</pre>
        </template>
        <template v-else>
          <pre :style="{
              'overflow-y': moreView === false ? 'hidden' : 'hidden',
              'max-height': moreView === false ? 'none' : '6rem'
            }">{{content}}</pre>
        </template>
      </p>
    </div>
    <!-- [D] 상품평이 3줄이상인 경우, 더보기 버튼이 노출됩니다 -->
    <button type="button" class="btn_detail" :class="{
        'isMobile-btn': !isPCDevice
      }" v-if="moreView" @click="openView">
      <span class="txt">더 보기</span>
    </button>
    <button type="button" class="btn_detail" :class="{
        'isMobile-btn': !isPCDevice
      }" v-if="littleView" @click="closeView">
      <span class="txt">접기</span>
    </button>
  </div>
</template>

<script>
import { isPCDevice } from '@/utils/utils'

export default {
  data () {
    return {
      moreView: false,
      littleView: false,
      isPCDevice: isPCDevice()
    }
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  methods: {
    openView () {
      this.moreView = false
      this.littleView = true
    },
    closeView () {
      this.moreView = true
      this.littleView = false
    },
    checkMore () {
      if (this.$el.getElementsByClassName('bx_review')[0].offsetHeight > 66) {
        this.moreView = true
      } else {
        this.moreView = false
      }
    }
  },
  watch: {
    content () {
      this.$nextTick(() => {
        this.checkMore()
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.checkMore()
    })
  }
}
</script>

<style>
.desc p {
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
.bx_review pre {
  max-width: 1170px;
  word-break: break-all;
  white-space: pre-wrap;
}
.btn_detail {
  padding: 0;
}
.btn_detail .txt {
  display: inline-block;
  font-size: 14px;
  color: #969696;
  vertical-align: middle;
  text-decoration: underline;
}
.isMobile-btn .txt {
  font-size: 1.4rem;
}
</style>

