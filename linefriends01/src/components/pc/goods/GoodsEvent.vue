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
        :tabId="key"
        :bus="eventBus"
      >
        <goods-list
          :goods="section.products"
          :rows="section.pcPerRow"
        />
      </tab-content>
    </tab-container>
    <goods-thumb-list
      v-else
      :goods="sections[0].products"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import GoodsList from './GoodsEventList'
import TabContainer from '@/components/pc/layout/common/TabContainer'
import TabContent from '@/components/pc/layout/common/TabContent'
import GoodsThumbList from './GoodsThumbList'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'GoodsEvent',
  components: {
    GoodsList,
    TabContainer,
    TabContent,
    GoodsThumbList
  },
  props: {
    eventNo: {
      type: Number,
      required: true
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
    ...mapActions('display', ['fetchGoodsEvent'])
  }
}
</script>
