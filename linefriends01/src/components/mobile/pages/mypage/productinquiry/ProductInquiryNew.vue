<template>
  <div>
    <sub-page-header :title="$t('mypage.productinquiry.title')" />

    <div id="container">
      <goods-inquiry-container />
    </div>
  </div>
</template>

<script>
import SubPageHeader from '../../../layout/header/SubPageHeader'
import GoodsInquiryContainer from '../../../inquiry/GoodsInquiryContainer'
import { Alert } from '@/utils/event-bus'

export default {
  name: 'ProductInquiryNew',
  components: {
    SubPageHeader,
    GoodsInquiryContainer
  },
  data () {
    return {
      agree: false,
      opinion: ''
    }
  },
  methods: {
    submit () {
      if (!this.agree) {
        // return alert('동의사항을 확인해 주세요')
        return Alert({
          message: '동의사항을 확인해 주세요'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inquiry-button {
  padding: 0 2rem 4rem;
}
</style>
