<template>
  <div>
    <sub-page-header title="개인정보처리방침" />
    <div class="policy">
      <div
        class="policy-content"
        v-html="terms.pi_process.contents">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'

export default {
  name: 'privacy',
  components: {
    SubPageHeader
  },
  computed: {
    ...mapState('common', ['terms'])
  }
}
</script>

<style lang="scss" scoped>

</style>
