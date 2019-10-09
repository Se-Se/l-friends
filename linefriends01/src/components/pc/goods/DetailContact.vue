<template>
  <section class="detail-default detail-contact">
    <div class="detail-default__header">
      <h2 v-if="inquiryList && inquiryList.totalCount > 0" class="detail-default__header-title">
        {{ $t('goods.detailContact.title') }}
        <span class="detail-default__header-cnt">{{ inquiryList.totalCount }}</span>
      </h2>
      <div v-if="inquiryList && inquiryList.totalCount > 0" class="detail-default__header-option _contact">
        <div class="detail-default__header-add">
          <white-button :data="listAdd" event="contactAdd" @childs-event="layerViews" />
        </div>
      </div>
    </div>
    <template v-if="inquiryList && inquiryList.totalCount > 0">
      <ul class="detail-default__list">
        <li v-for="(contact, key) in inquiryList.item" :key="`${contact.inquiryNo}_${key}`" :class="{
            'detail-default__item': true,
            '_click': contact.answers && opened.includes(key)
          }">
          <div class="detail-detail__qe" @click="toggle(key)">
            <div class="detail-contact__topic">
              <i v-if="contact.secreted === true" class="detail-contact__topic-icon">
                <img src="~@/assets/images/pc/icons/ic-lock.svg">
              </i>
              <p class="detail-contact__topic-title">
                [{{ getTypeName(contact.type) }}]
              </p>
              <span v-if="contact.answers" :class="{
                  'detail-contact__topic-status': true,
                  '_success': contact.answers
                }">
                {{ $t('goods.detailContact.answerOk') }}
              </span>
              <span v-else :class="{
                  'detail-contact__topic-status': true
                }">
                {{ $t('goods.detailContact.answerWait') }}
              </span>
            </div>
            <div class="detail-default__item-content detail-contact__content">
              <template v-if="contact.administrator === false && contact.myInquiry === false && contact.secreted === true">
                <p>{{ $t('goods.detailContact.sceretContact') }}</p>
              </template>
              <template v-else>
                <more-view :content="contact.content"></more-view>
              </template>
            </div>
            <div class="detail-default__item-footer detail-contact__footer">
              <div class="detail-default__item-footer__info">
                <p>{{ contact.memberId }}</p>
                <p>{{ contact.registerYmdt | dateFormatStr('yyyy.MM.dd HH:mm') }}</p>
              </div>
              <div v-if="!contact.answers && contact.myInquiry" class="detail-contact__footer-actions">
                <white-button :data="modifyBtn" event="modifyView" @childs-event="layerViews('modifyview', contact)" />
                <white-button :data="deleteBtn" event="deleteView" @click="deleteInquiry(contact.inquiryNo)" />
              </div>
            </div>
          </div>
          <template v-if="contact.answers && opened.includes(key)">
            <div v-for="( answer, key ) in contact.answers" :key="key" class="detail-contact__answer">
              <div class="detail-contact__answer-header">
                <h2>{{ $t('goods.detailContact.lineAnswer') }}</h2>
              </div>
              <div class="detail-contact__answer-content">
                <p>
                  <template v-if="contact.secreted !== true || contact.myInquiry">
                    <more-view :content="answer.content"></more-view>
                  </template>
                  <template v-else>
                    {{ $t('goods.detailContact.sceretAnswer') }}
                  </template>
                </p>
              </div>
              <div class="detail-contact__answer-date">
                <p>
                  {{ contact.updateYmdt | dateFormatStr('yyyy.MM.dd HH:mm') }}
                </p>
              </div>
            </div>
          </template>
        </li>
      </ul>
      <div class="detail-default__pagination">
        <pagination v-model="page" :total="inquiryList.totalCount" :limit="20" :toTop="false" @input="fetchList" />
      </div>
    </template>
    <div v-else class="detail-default__nodata">
      <detail-no-data :title="$t('goods.detailContact.noData')" />
      <white-button :data="listAdd" event="contactAdd" @childs-event="layerViews" />
    </div>
    <layer-popup :visible="layerPopupStatus === 'modifyView'" type="normal" :title="$t('goods.detailContact.modify')" @close="layerPopupStatus = null" :header="true">
      <div class="detail-contact__select">
        <select-item id="type" v-model="form.add.type" :placeholder="$t('goods.detailContact.typeOfInquiry')" :data="malls.productInquiryType" />
      </div>
      <div class="detail-contact__textarea">
        <textarea-item v-model="form.add.content" :length="1000 > 0" :placeholder="$t('mypage.productinquiry.placeholder.pc.content')" :max-length="1000" />
      </div>
      <div class="detail-contact__radio">
        <switch-item type="checkbox" v-model="form.add.secreted" :title="secret.title" :name="secret.name" :value="secret.value" :chk="secret.chk" :bold="false" :disabled="true" />
      </div>
      <div class="detail-contact__txt">
        <p>
          {{ $t('goods.detailContact.orderInfo.item1') }} <a href="/mypage/inquiry">{{ $t('goods.detailContact.contact') }}</a>{{ $t('goods.detailContact.orderInfo.item2') }}
        </p>
      </div>
      <div class="detail-contact__btn">
        <button type="button" class="detail-contact__footer--btn add" @click="submit">
          {{ $t('goods.detailContact.fix') }}
        </button>
      </div>
    </layer-popup>
    <layer-popup :visible="layerPopupStatus === 'contactAdd'" type="goods" title="상품문의 등록" info="false" button="no" @close="layerPopupStatus = null" :header="true">
      <div class="detail-contact__select">
        <select-item id="type" v-model="formAddType" :placeholder="$t('goods.detailContact.addOfInquiry')" :data="malls.productInquiryType" />
      </div>
      <div class="detail-contact__textarea">
        <textarea-item v-model="form.add.content" :length="1000 > 0" :placeholder="$t('mypage.productinquiry.placeholder.pc.content')" :max-length="1000" />
      </div>
      <div class="detail-contact__radio">
        <switch-item type="checkbox" v-model="form.add.secreted" :title="secret.title" :name="secret.name" :bold="false" :disabled="true" />
      </div>
      <div class="detail-contact__txt">
        <p>
          {{ $t('goods.detailContact.orderInfo.item1') }} <a href="/mypage/inquiry">{{ $t('goods.detailContact.contact') }}</a>{{ $t('goods.detailContact.orderInfo.item2') }}
        </p>
      </div>
      <div class="detail-contact__btn">
        <button type="button" class="detail-contact__footer--btn add" @click="submit">
          {{ $t('goods.detailContact.add') }}
        </button>
      </div>
    </layer-popup>
  </section>
</template>
<script>
import LayerPopup from '../layout/common/LayerPopup'
import Pagination from '../assets/Pagination'
import WhiteButton from '../assets/buttons/WhiteButton'
import SelectItem from '../assets/Select'
import SwitchItem from '../assets/Switch'
import DetailNoData from '../goods/DetailNoData'
import TextareaItem from '../assets/TextArea'
import MoreView from '@/components/common/MoreView'
import { mapState, mapGetters, mapActions } from 'vuex'
import { Alert, Confirm } from '@/utils/event-bus'
import $ from 'jquery'

export default {
  name: 'DetailContact',
  components: {
    Pagination,
    WhiteButton,
    LayerPopup,
    SelectItem,
    SwitchItem,
    DetailNoData,
    TextareaItem,
    MoreView
  },
  data () {
    return {
      opened: [],
      modify: false,
      bgActive: false,
      modifyForm: false,
      layerPopupStatus: null,
      visible: true,
      page: this.$router.currentRoute.params.page || 1,
      form: {
        update: {
          action: 'button',
          to: '',
          title: this.$t('mypage.productinquiry.update'),
          type: 'short'
        },
        delete: {
          action: 'link',
          to: '',
          title: this.$t('mypage.productinquiry.delete'),
          type: 'short'
        },
        cancel: {
          action: 'button',
          to: '',
          title: this.$t('mypage.productinquiry.cancel'),
          type: 'short'
        },
        add: {
          productNo: 0,
          type: null,
          secreted: true,
          title: '',
          content: '',
          parentInquiryNo: 0,
          email: ''
        }
      },
      privacy: {
        idx: 0,
        title: '비공개',
        name: 'privacy',
        value: 'privacy',
        checked: false
      },
      listAdd: {
        action: 'button',
        width: 141,
        height: 40,
        font: 14,
        title: '상품문의 등록하기'
      },
      modifyBtn: {
        action: 'button',
        width: 54,
        height: 32,
        font: 12,
        title: '수정'
      },
      deleteBtn: {
        action: 'button',
        width: 54,
        height: 32,
        font: 12,
        title: '삭제'
      },
      secret: {
        idx: 0,
        title: '비공개',
        name: 'secret',
        value: 'secret',
        chk: false
      }
    }
  },
  computed: {
    ...mapState('productinquiry', ['inquiryList', 'inquiry']),
    ...mapState('common', ['malls']),
    ...mapState('profile', ['profile']),
    ...mapGetters(['isLogined']),
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
      return '상품문의 ' + (this.isEdit ? '수정' : '등록')
    },
    formAddType: {
      get () {
        return this.form.add.type || this.malls.productInquiryType[0].value
      },
      set (val) {
        this.form.add.type = val
      }
    }
  },
  async mounted () {
    if (this.isEdit) {
      await this.fetchProductInquiryDetail({ productNo: this.goodsNo, inquiryNo: this.inquiryNo })
      this.form.add = this.inquiry
    } else {
      this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page })
      this.form.add.productNo = this.goodsNo
      this.form.add.type = null
      if (this.isLogined) {
        this.form.add.email = this.profile.email
      }
    }
  },
  methods: {
    ...mapActions('productinquiry', [
      'fetchProductInquiry',
      'fetchProductInquiryDetail',
      'postProductInquiry',
      'putProductInquiry',
      'deleteProductInquiry']
    ),
    toggle (id) {
      const index = this.opened.indexOf(id)
      if (index > -1) {
        this.opened.splice(index, 1)
        this.modify = false
        this.bgActive = false
      } else {
        this.opened = []
        this.opened.push(id)
        this.bgActive = true
      }
    },
    layerViews (event, inquiry) {
      if (!this.isLogined) {
        this.$router.push('/member/login')
      } else {
        this.layerPopupStatus = event
        // $('html').css('overflow', 'hidden')
        if (inquiry) {
          inquiry.secreted = true
          this.form.add = {
            ...inquiry
          }
          this.form.content = inquiry.showContent
          this.layerPopupStatus = 'modifyView'
        } else {
          this.form.add = {
            title: '',
            productNo: this.goodsNo,
            type: this.malls.productInquiryType[0].value,
            secreted: true
          }
        }
      }
    },
    reviewPopAction () {
      this.eventBus.$emit('openPopup')
    },
    getTypeName (type) {
      return this.malls.productInquiryType.filter(item => item.value === type)[0].label
    },
    fetchList () {
      this.opened = []
      this.$emit('update')
      this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page })
    },
    async submit () {
      if (!this.form.add.content || (this.form.add.content.trim() === '')) {
        return Alert({
          title: this.$t('mypage.productinquiry.title'),
          message: this.$t('mypage.productinquiry.validation.emptyContent1')
        })
      } else if (this.form.add.content && this.form.add.content.length > 1000) {
        return Alert({
          title: this.$t('mypage.productinquiry.title'),
          message: this.$t('mypage.productinquiry.validation.overSizeContent')
        })
      }
      Confirm({
        title: this.$t('mypage.productinquiry.title'),
        message: this.$t('mypage.productinquiry.confirm.' + (this.isEdit ? 'update' : 'add')),
        callback: async () => {
          try {
            if (this.isEdit) {
              await this.putProductInquiry(this.form.add).then(() => {
                // alert('수정되었습니다.')
                Alert({
                  message: '수정되었습니다.'
                })
              })
            } else {
              if (this.form.add.content === null) {
                // alert(this.$t('mypage.productinquiry.validation.emptyContent'))
                Alert({
                  message: this.$t('mypage.productinquiry.validation.emptyContent')
                })
                return false
              }
              await this.postProductInquiry(this.form.add)
            }

            this.page = 1
            this.moveToGoodsDetail()
          } catch (e) {
            if (e.data.code === 'I0007') {
              Alert({
                title: '알림',
                message: e.data.message
              })
              this.moveToGoodsDetail(true)
            }
          }
        }
      })
    },
    moveToGoodsDetail (reloadFlag) {
      if (reloadFlag) {
        this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page })
      }
      this.layerPopupStatus = null
      this.form.add.content = ''
    },
    deleteInquiry (inquiryNo) {
      Confirm({
        message: this.$t('mypage.productinquiry.confirm.delete'),
        callback: () => {
          this.deleteProductInquiry({
            inquiryNo: inquiryNo,
            page: this.page,
            productNo: this.$route.params.goodsNo
          }).then(() => {
            // alert('삭제되었습니다.')
            Alert({
              message: '삭제되었습니다.'
            })
          })
          this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page })
        }
      })
      // if (confirm(this.$t('mypage.productinquiry.confirm.delete'))) {
      //   this.deleteProductInquiry({
      //     inquiryNo: inquiryNo,
      //     page: this.page,
      //     productNo: this.$route.params.goodsNo
      //   }).then(() => {
      //     // alert('삭제되었습니다.')
      //     Alert({
      //       message: '삭제되었습니다.'
      //     })
      //   })
      //   this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page })
      // }
    }
  }
}
</script>
