<template>
  <div>
    <main-wrapper :main='true'>
        <div class="goods-search">
          <p class="goods-search__title goods-search__title-no">
            <span class="result">{{ keyword }}</span> <em>검색결과</em>
          </p>
          <detail-no-data title="검색 결과가 없습니다."/>
          <div class="goods-search__nodata-footer"> 
            <default-button :data="form.ok" @click="$router.push({ path: '/' })"/>
          </div>
        </div>
    </main-wrapper>
  </div>
</template>
<script>
import MainWrapper from '../../layout/common/MainWrapper'
import LayoutWidth from '../../layout/common/LayoutWidth'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import DetailRecommand from '../../goods/DetailRecommand'
import DetailNoData from '../../goods/DetailNoData'
import DefaultButton from '../../assets/buttons/DefaultButton'

export default {
  name: 'SearchNoData',
  components: {
    MainWrapper,
    LayoutWidth,
    BreadCrumbs,
    DetailRecommand,
    DetailNoData,
    DefaultButton
  },
  props: ['keyword'],
  data () {
    return {
      basicCrumbs: '홈',
      title: false,
      bestgoods: true,
      form: {
        ok: {
          action: 'button',
          to: '',
          title: this.$t('button.goHome'),
          type: 'free',
          size: 360
        }
      }
    }
  }
}
</script>
