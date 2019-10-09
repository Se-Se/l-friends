<template>
  <div v-if="sections">
    <tab-container
      v-if="sections.length > 1"
      :bus="eventBus"
      :tabs="tabs"
    >
      <tab-content
        v-for="(section, key) in sections"
        :key="key"
        :tab-id="key"
        :bus="eventBus"
      >
        <goods-list
          :direction="direction"
          :width="width"
          :margin="margin"
          :skin="skin"
          :paddingSide="paddingSide"
          :goods="getGoods(key)"
        />
        <goods-button :cate="1" />
      </tab-content>
    </tab-container>
    <goods-list
      v-else
      :direction="direction"
      :width="width"
      :margin="margin"
      :skin="skin"
      :paddingSide="paddingSide"
      :goods="getGoods(0)"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import GoodsList from './GoodsList'
import GoodsButton from '@/components/mobile/goods/GoodsButton'
import TabContainer from '@/components/mobile/common/tab/TabContainer'
import TabContent from '@/components/mobile/common/tab/TabContent'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    GoodsList,
    GoodsButton,
    TabContainer,
    TabContent
  },
  props: {
    eventNo: {
      type: Number,
      required: true
    },
    direction: {
      type: String,
      default: 'vertical'
    },
    width: {
      type: Number,
      default: 20.2
    },
    margin: {
      type: Number,
      default: 1.2
    },
    skin: {
      type: String,
      default: 'normal'
    },
    paddingSide: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      eventBus: new Vue()
    }
  },
  computed: {
    ...mapGetters('display', {
      sectionses: 'events'
    }),
    sections () {
      return this.sectionses[this.eventNo]
    },
    tabs () {
      let tabs = {}

      for (const i in this.sections) {
        const section = this.sections[i]
        tabs[section.label] = i
      }

      return tabs
    }
  },
  mounted () {
    this.fetchGoodsEvent(this.eventNo)
  },
  methods: {
    ...mapActions('display', ['fetchGoodsEvent']),
    getGoods (key) {
      if (this.limit === 0) {
        return this.sections[key].products
      }

      return this.sections[key].products.slice(0, this.limit)
    }
  }
}
</script>
