<template>
  <modal-layer-popup :visible.sync="active" :popup_size_class="'popup_size_4'" popup_name="productInquiry" @closeProductInquiryPopup="closeProductInquiryPopup" :close_confirm_msg="cancelMsg">
    <h1 slot="title">상품 문의 등록</h1>
    <div class="con">
      <table class="layer-popup__tbl">
          <tr>
            <th>문의유형</th>
            <td>
              <div
                v-for="(inquiryType, index) in inquiryTypes"
                :key="index"
                class="switch-item"
              >
                <switch-item
                  type="radio"
                  name="group_qna"
                  :id="inquiryType.value"
                  :value="inquiryType.value"
                  :title="inquiryType.label"
                  :radioChecked="type === inquiryType.value"
                  @change="changeType"
                />
              </div>
            </td>
          </tr>
          <tr>
            <th>문의내용</th>
            <td class="active">
              <div class="area_qna_form">
                <form>
                  <fieldset>
                    <div class="bx_write">
                      <textarea
                        :placeholder="$t('mypage.productinquiry.placeholder.pc.content')"
                        v-model="content"
                        ref="content"
                        maxlength="1000"
                        class="review"></textarea>
                        <p class="status-textnumb">
                          <em>{{contentLength}}</em>/1,000
                        </p>
                        <p class="status-open">
                          <switch-item
                            type="checkbox"
                            check="round"
                            title="비공개"
                            :bold="true"
                            :disabled="true"
                            v-model="secreted"
                            id="personal2"
                          />
                        </p>
                    </div>
                    <!-- <div class="write_btm table-grid">
                      <div class="internal">
                        <span class="bx_input">
                          <input type="checkbox" id="personal2" v-model="secreted">
                          <label for="personal2">비공개</label>
                        </span>
                      </div>
                    </div> -->
                  </fieldset>
                </form>
              </div>
            </td>
          </tr>
      </table>
      <footer class="layer-popup__footer space">
        <button
          type="button"
          class="layer-popup__footer--btn close"
          @click="closeProductInquiryPopup">
          취소
        </button>
        <button
          type="button"
          class="layer-popup__footer--btn upload"
          @click.prevent="registerInquiry">
          등록 
        </button>
      </footer>
    </div>
  </modal-layer-popup>
</template>
<script>
import SwitchItem from '@/components/pc/assets/Switch'
import ModalLayerPopup from '@/components/pc/popup/ModalLayerPopupNew'
import { addClass, removeClass } from '@/utils/utils'
import { Alert, Confirm } from '@/utils/event-bus'
import $ from 'jquery'
export default {
  data () {
    return {
      type: 'PRODUCT',
      secreted: true,
      contentInput: '',
      contentLength: 0,
      showTypeFlg: false,
      showContentFlg: false,
      active: false,
      cancelMsg: '상품문의 작성을 취소하시겠습니까?',
      bodyScrollTop: 0
    }
  },
  props: ['inquiryTypes', 'productNo', 'isShowContact'],
  components: {
    ModalLayerPopup,
    SwitchItem
  },
  computed: {
    content: {
      get () {
        return this.contentInput
      },
      set (content) {
        this.contentInput = content
        this.contentLength = this.contentInput.length
      }
    }
  },
  methods: {
    close () {
      this.content = ''
      this.type = 'PRODUCT'
      this.secreted = true
      $('html').css('overflow', 'scroll')
      this.$emit('update:isShowContact', false)
      this.closeProductInquiryPopup()
    },
    registerInquiry () {
      if (this.content.trim() === '' && this.content.trim().length === 0) {
        this.$refs.content.focus()
        Alert({
          title: this.$t('mypage.productinquiry.title'),
          message: this.$t('mypage.productinquiry.validation.emptyContent')
        })
        return
      }
      Confirm({
        title: this.$t('mypage.productinquiry.title'),
        message: this.$t('mypage.productinquiry.confirm.' + (this.isEdit ? 'update' : 'add')),
        callback: async () => {
          const inquiry = {
            type: this.type,
            secreted: this.secreted,
            content: this.content,
            productNo: this.productNo,
            title: '',
            parentInquiryNo: 0
          }
          this.$store.dispatch('productinquiry/postProductInquiry', inquiry).then(() => {
            Alert({
              message: this.$t('mypage.productinquiry.alert.registerComplete')
            })
            removeClass(document.body, 'no_scroll')
            document.body.style.top = '0px'
            window.scrollTo(0, this.bodyScrollTop * -1)
            Object.assign(this.$data, this.$options.data())
          })
        }
      })
    },
    openProductInquiryPopup () {
      this.active = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
    },
    closeProductInquiryPopup () {
      Confirm({
        message: this.cancelMsg,
        callback: () => {
          removeClass(document.body, 'no_scroll')
          document.body.style.top = '0px'
          window.scrollTo(0, this.bodyScrollTop * -1)
          Object.assign(this.$data, this.$options.data())
        }
      })
    },
    changeType (target) {
      this.type = target.value
    }
  }
}
</script>
