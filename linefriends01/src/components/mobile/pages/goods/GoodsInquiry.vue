<template>
  <div>
    <sub-page-header
      :title="title"
      :close="isFromOrder ? false : true"
    />
    <div id="container">
      <div class="goods-qna">
        <div class="goods-qna__wrap">
          <app-select
            id="type"
            v-model="form.type"
            :placeholder="$t('mypage.productinquiry.placeholder.mobile.type')"
            :options="malls.productInquiryType"
          />
          <div class="goods-qna__box">
            <app-textarea
              class="goods-qna__box-textarea"
              v-model="form.content"
              :height="24"
              :placeholder="$t('mypage.productinquiry.placeholder.pc.content')"
              :max-length="1000"
            />
          </div>
          <app-checkbox
            v-model="form.secreted"
            class="goods-qna__check"
            size="normal"
            :disabled="true"
          >
            <span class="goods-qna__label">{{ $t('mypage.productinquiry.secret') }}</span>
          </app-checkbox>
        </div>
      </div>
    </div>

    <bottom-fixed class="goods-qna__register">
      <app-button
        type="success"
        @click="submit"
      >
        {{ $t('mypage.productinquiry.button') }}
      </app-button>
    </bottom-fixed>
  </div>
</template>
<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppSelect from '@/components/mobile/common/input/Select'
import AppTextarea from '@/components/mobile/common/input/Textarea'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import AppButton from '@/components/mobile/common/button/Button'
import BottomFixed from '@/components/mobile/common/BottomFixed'
import { mapState, mapActions } from 'vuex'
import { Alert, Confirm } from '@/utils/event-bus'

export default {
  name: 'GoodsInquiry',
  components: {
    SubPageHeader,
    AppSelect,
    AppTextarea,
    AppCheckbox,
    AppButton,
    BottomFixed
  },
  computed: {
    ...mapState('common', ['malls']),
    ...mapState('profile', ['profile']),
    ...mapState('productinquiry', ['inquiry']),
    $route () {
      return this.$router.currentRoute
    },
    goodsNo () {
      return this.$route.params.goodsNo
    },
    inquiryNo () {
      return this.$route.params.inquiryNo
    },
    isEdit () {
      return this.inquiryNo !== undefined
    },
    title () {
      return this.$t('mypage.productinquiry.title') + ' ' + this.$t('mypage.productinquiry.' + (this.isEdit ? 'update' : 'add'))
    },
    isFromOrder () {
      return this.$store.state.route.from.name === 'OrderList' || this.$store.state.route.from.name === 'OrderDetail'
    }
  },
  data () {
    return {
      form: {
        productNo: 0,
        type: null,
        secreted: true,
        title: '',
        content: '',
        parentInquiryNo: 0,
        email: ''
      }
    }
  },
  async mounted () {
    if (this.isEdit) {
      await this.fetchProductInquiryDetail({ productNo: this.goodsNo, inquiryNo: this.inquiryNo })
      this.inquiry.secreted = true
      this.form = this.inquiry
    } else {
      this.form.productNo = this.goodsNo
      this.form.type = this.malls.productInquiryType[0].value
      this.form.email = this.profile.email
    }
  },
  methods: {
    ...mapActions('productinquiry', [
      'fetchProductInquiryDetail',
      'postProductInquiry',
      'putProductInquiry'
    ]),
    async submit () {
      if (this.form.content.trim() === '') {
        return Alert({
          title: this.$t('mypage.productinquiry.title'),
          message: this.$t('mypage.productinquiry.validation.emptyContent1')
        })
      } else if (this.form.content.length > 1000) {
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
              await this.putProductInquiry(this.form).then(() => {
                // alert('수정되었습니다.')
                Alert({
                  message: '수정되었습니다.'
                })
              })
            } else {
              await this.postProductInquiry(this.form)
            }
            if (this.isFromOrder) {
              this.$router.go(-1)
            } else {
              this.moveToGoodsDetail()
            }
          } catch (e) {
            if (e.data.code === 'I0007') {
              // alert(e.data.message)
              Alert({
                message: e.data.message
              })
              this.moveToGoodsDetail()
            }
          }
        }
      })
    },
    moveToGoodsDetail () {
      let query = {
        tab: 'inquiry'
      }
      if (this.$route.query.currScroll) {
        query.currScroll = this.$route.query.currScroll
      }
      this.$router.push({
        name: 'GoodsDetail',
        params: {
          goodsNo: this.goodsNo
        },
        query
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-qna {
  padding: 2rem 2rem 0;
  &__box {
    position: relative;
    margin-top: 1rem;
  }
  &__check {
    display: inline-block;
    padding: 1.2rem 0 2rem 0;
    vertical-align: middle;
  }
  &__label {
    margin-left: 0.8rem;
    font-family: "Noto Sans KR";
    font-weight: normal;
    font-size: 1.2rem;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #666;
  }
  &__info {
    margin-top: 1.2rem;
    color: #999999;
    font-size: 1.2rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.006rem;
    a {
      display: inline-block;
      border-bottom: 1px solid #4ba4d9;
      color: #4ba4d9;
    }
  }
}
</style>
