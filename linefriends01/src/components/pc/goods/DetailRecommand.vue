<template>
  <div class="detail-recommand">
    <layout-width>
      <h2 class="detail-recommand__title">{{ $t('goods.detailRecommand.title') }}</h2>
      <div calss="detail-recommand__content">
        <goods-list
          :goods="recommand"
          mode="recommand"
        />
      </div>
    </layout-width>
  </div>
</template>
<script>
import LayoutWidth from '../layout/common/LayoutWidth'
import GoodsList from '../goods/GoodsList'

export default {
  name: 'goods-detail-header',
  components: {
    LayoutWidth,
    GoodsList
  },
  props: {
    recommand: {
      required: false
    }
  }
}
</script>
