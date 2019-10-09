<template>
  <div class="terms-detail">
    <sub-page-header
      :title="termData.title"
      :close="true"
    />
    <div
      id="container"
      v-html="termData.content"
    />
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import { mapState } from 'vuex'

export default {
  name: 'TermsDetail',
  components: {
    SubPageHeader
  },
  computed: {
    ...mapState('common', ['terms']),
    termData () {
      let title = ''
      let content = ''
      if (this.terms) {
        if (this.$route.params.term === 'service') {
          title = this.$t('member.join.terms.title.service')
          content = (this.terms.use.contents) ? this.terms.use.contents : ''
        } else {
          title = this.$t('member.join.terms.title.privercy')
          content = (this.terms.pi_collection_and_use_required.contents) ? this.terms.pi_collection_and_use_required.contents : ''
        }
      }
      return {
        title,
        content
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ #container {
  padding: 2rem 2rem;
  font-family: 'Noto Sans KR';
  font-size: 1.4rem;
  line-height: 1.5;
  letter-spacing: -0.01rem;
  color: #666;

  strong {
    color: #333;
    font-weight: 500;
  }
  .privacy_title {
    font-weight: 500;
  }
  .p1 {
    font-size: 1.4rem !important;

    * {
      font-size: 1.4rem !important;
    }

    b {
      display: inline-block;
      padding-bottom: 1rem !important;
      font-size: 1.6rem !important;
      font-weight: 500 !important;
    }
  }
}
</style>
