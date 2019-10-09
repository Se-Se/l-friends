<template>
  <div>
    <main-wrapper>
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <order-container />
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import MainWrapper from '@/components/pc/layout/common/MainWrapper'
import LayoutWidth from '@/components/pc/layout/common/LayoutWidth'
import BreadCrumbs from '@/components/pc/layout/common/BreadCrumbs'
import OrderContainer from '@/components/pc/order/OrderContainer'

export default {
  name: 'OrderComplete',
  components: {
    MainWrapper,
    LayoutWidth,
    OrderContainer,
    BreadCrumbs
  },
  data () {
    return {
      basicCrumbs: '홈'
    }
  }
}
</script>
