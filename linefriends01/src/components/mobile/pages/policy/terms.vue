<template>
  <div>
    <sub-page-header title="이용약관" />
    <div class="policy">
      <div
        class="policy-content"
        v-html="terms.use.contents">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'

export default {
  name: 'terms',
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
