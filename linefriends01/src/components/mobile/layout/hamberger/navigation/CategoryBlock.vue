<template>
  <ul class="hamberger-gnb--block">
    <li
      v-for="(category, index) in categories"
      :key="category.categoryNo"
      :class="{
        'hamberger-gnb__item': true,
        categories: true,
        active: active === index,
        updated: isNew(category)
      }"
    >
      <label
        v-if="category.children"
        class="hamberger-gnb__label"
        @click="toggleActive(index)"
      >
        <span>{{ category.label }}</span>
        <i
          v-if="category.children"
          class="hamberger-arrow"
        >expand</i>
        <div class="hamberger--update"
          v-if="isNew(category)"
          :style="{
            width: updateIcon + 'px',
            height: updateIcon + 'px'
          }"
        ></div>
      </label>
      <router-link @click.native="commitLeftClose"
        v-if="!category.children"
        class="hamberger-gnb__label"
        :to="'/goods/' + category.categoryNo"
      >
        {{ category.label }}
      </router-link>
      <div v-if="category.children">
        <div
          v-show="active === index"
          class="hamberger-expand"
        >
          <ul class="hamberger-lnb">
            <li class="hamberger-lnb__item">
              <router-link @click.native="commitLeftClose"
                :to="'/goods/' + category.categoryNo"
                class="hamberger-lnb__label"
              >
                {{ $t('menu.all') }}
              </router-link>
            </li>
            <li
              v-for="submenu in category.children"
              :key="submenu.categoryNo"
              :class="{
                'hamberger-lnb__item': true,
                updated: isNew(submenu)
              }"
            >
              <router-link @click.native="commitLeftClose"
                :to="'/goods/' + category.categoryNo + '/' + submenu.categoryNo"
                class="hamberger-lnb__label"
              >
                {{ submenu.label }}
                <div class="hamberger--update"
                  v-if="isNew(submenu)"
                  :style="{
                    width: updateIcon + 'px',
                    height: updateIcon + 'px'
                  }"
                ></div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import Vue from 'vue'
import TransitionExpand from '@/components/common/transition/TransitionExpand'
import { mapState, mapActions } from 'vuex'
import { Alert } from '@/utils/event-bus'

export default {
  name: 'CategoryBlock',
  components: {
    TransitionExpand
  },
  props: {
    active: {
      type: Number,
      required: true
    },
    updateIcon: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState('categories', ['categories', 'news'])
  },
  async mounted () {
    await this.newProductCategoryFetch()

    if (!this.categories) {
      this.fetchAll().catch(() => {
        // alert('카테고리를 불러오지 못했습니다.')
        Alert({
          message: '카테고리를 불러오지 못했습니다.'
        })
      })
    }
  },
  methods: {
    ...mapActions('categories', ['fetchAll', 'newProductCategoryFetch']),
    toggleActive (index) {
      this.$emit('setActive', index)
    },
    isNew (category) {
      if (this.news) {
        let isNew = this.news.indexOf(category.categoryNo) >= 0
        for (let submenu in category.children) {
          isNew = isNew || this.news.indexOf(submenu.categoryNo) >= 0
        }

        return isNew
      }
    },
    commitLeftClose () {
      this.$emit('commitLeftClose')
    }
  }
}
</script>

<style lang="scss" scoped>
.hamberger-gnb--block {
  padding: 0.4rem 0;
}
</style>
