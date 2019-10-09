<template>
  <div class="character-select">
    <sub-page-header
      title="캐릭터 선택"
      close
    />
    <div id="container">
      <brand-container
        :gap="1.8"
        :allcharacter="true"
        :brand="{
          icon: '/static/images/common/character/ic-all.png',
          brandNo: null,
          label: '캐릭터 전체',
          brands: []
        }"
        @select="setBrand"
      />
      <brand-container
        v-for="(item, key) in brands"
        :key="key"
        :gap="1.8"
        :allcharacter="true"
        :brand="item"
        @select="setBrand"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import BrandContainer from '@/components/mobile/brand/BrandContainer'

export default {
  name: 'CharacterSelect',
  components: {
    SubPageHeader,
    BrandContainer
  },
  data () {
    return {
      from: null
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.from = from
    })
  },
  computed: {
    ...mapState('brand', ['brands'])
  },
  methods: {
    setBrand (brandNo) {
      let query = {}
      let path = this.from ? this.from.path : '/goods'
      if (this.from && (this.from.name === 'GoodsList' || this.from.name === 'Search' || this.from.name === 'GoodsSaleList')) {
        query = this.from.query
      }

      if (brandNo) {
        query.brandNo = brandNo
      } else {
        delete query.brandNo
      }

      this.$router.replace({
        path,
        query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  background: #fafafa;
  padding-bottom: 1.55rem;
}
</style>
