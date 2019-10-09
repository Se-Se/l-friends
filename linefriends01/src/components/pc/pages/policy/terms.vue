<template>
   <div>
    <main-wrapper>
      <layout-width>
        <div class="policy">
          <header class="policy-header">
            <h2 class="policy-header__title">이용약관</h2>          
          </header>
          <div
            class="policy-content"
            v-html="terms.use.contents">
          </div>
        </div>
      </layout-width>
    </main-wrapper>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MainWrapper from '@/components/pc/layout/common/MainWrapper'
import LayoutWidth from '@/components/pc/layout/common/LayoutWidth'

export default {
  name: 'terms',
  components: {
    MainWrapper,
    LayoutWidth
  },
  computed: {
    ...mapState('common', ['terms'])
  }
}
</script>

<style lang="scss" scoped>

</style>
