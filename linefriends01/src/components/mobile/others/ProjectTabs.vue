<template>
  <div class="project-detail__tabs">
    <ul class="project-detail__tabs-list">
      <li v-for="(section, index) in event.sectionMenu" :key="index" :class="{
          'project-detail__tabs-item': true,
          'active': active === index
        }">
        <button class="project-detail__tabs-btn" type="button" @click="tabMove(index)">
          {{ section.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
<script>
import $ from 'jquery'
import { mapState } from 'vuex'

const $window = $(window)

export default {
  name: 'ProjectTabs',
  data () {
    return {
      active: 0,
      $tabs: null
    }
  },
  computed: {
    ...mapState('event', ['event'])
  },
  methods: {
    tabMove (index) {
      $window.scrollTop($(`#event-${index}`).offset().top - this.$tabs.height())
      this.active = index
    },
    handleScrollChangeNane () {
      if (this.event.sectionMenu) {
        for (let i = 0; i < this.event.sectionMenu.length; i++) {
          if ($window.scrollTop() > $(`#event-${i}`)[0].offsetTop - 150) {
            $('.project-detail__tabs-list').find('li').removeClass('active')
            $('.project-detail__tabs-list').find('li').eq(i).addClass('active')
          }
        }
      }
    }
  },
  mounted () {
    this.$tabs = $('.project-detail__tabs')
    window.addEventListener('scroll', this.handleScrollChangeNane)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScrollChangeNane)
  }
}
</script>
