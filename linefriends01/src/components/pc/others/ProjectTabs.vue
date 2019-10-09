<template>
  <div
    :class="{
      'project-detail__tabs': true,
      '__active': scrolled
    }"
    @scroll="handleScroll"
  >
    <div>
      <ul class="project-detail__tabs-list">
        <li
          :class="{
            'project-detail__tabs-item': true,
            'active': active === 'sharpPen'
          }"
        >
          <button
            type="button"
            @click="tabMove('sharpPen')"
          >
            SHARP PEN
          </button>
        </li>
        <li
          :class="{
            'project-detail__tabs-item': true,
            'active': active === 'plushPen'
          }"
        >
          <button
            type="button"
            @click="tabMove('plushPen')"
          >
            PLUSH PEN
          </button>
        </li>
        <li
          :class="{
            'project-detail__tabs-item': true,
            'active': active === 'figurePen'
          }"
        >
          <button
            type="button"
            @click="tabMove('figurePen')"
          >
            FIGURE PEN
          </button>
        </li>
        <li
          :class="{
            'project-detail__tabs-item': true,
            'active': active === 'In1Pen'
          }"
        >
          <button
            type="button"
            @click="tabMove('In1Pen')"
          >
            4 IN 1 PEN
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import * as $ from 'jquery'

export default {
  name: 'ProjectTabs',
  data () {
    return {
      active: 'sharpPen',
      scrolled: false,
      lastPosition: 0,
      limitPosition: $('.header__wrapper').outerHeight() + $('.bread-crumbs').outerHeight() + $('.empty').outerHeight() + $('.project-detail__coupon').outerHeight() + $('.project-detail__tabs').outerHeight(),
      noCoupon: $('.header__wrapper').outerHeight() + $('.bread-crumbs').outerHeight() + $('.empty').outerHeight() + $('.project-detail__tabs').outerHeight()
    }
  },
  mounted () {
    this.limitPosition = $('.header__wrapper').outerHeight() + $('.bread-crumbs').outerHeight() + $('.empty').outerHeight() + $('.project-detail__coupon').outerHeight() + $('.project-detail__tabs').outerHeight()
    this.noCoupon = $('.header__wrapper').outerHeight() + $('.bread-crumbs').outerHeight() + $('.empty').outerHeight() + $('.project-detail__tabs').outerHeight()
    this.$header = $('.header')
    this.$header.css('position', 'absolute')
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    tabMove (event) {
      $('html, body').scrollTop(this.limitPosition - 50)
      $('html, body').scrollTop(this.noCoupon - 50)
      this.$emit('childs-event', event)
      if (event === 'sharpPen') {
        this.active = 'sharpPen'
      } else if (event === 'plushPen') {
        this.active = 'plushPen'
      } else if (event === 'figurePen') {
        this.active = 'figurePen'
      } else if (event === 'In1Pen') {
        this.active = 'In1Pen'
      }
    },
    handleScroll () {
      if (this.lastPosition < window.scrollY && this.limitPosition < window.scrollY) {
        this.scrolled = true
      } else if (this.lastPosition < window.scrollY && this.noCoupon < window.scrollY) {
        this.scrolled = true
      }

      if (this.limitPosition > window.scrollY) {
        this.scrolled = false
      } else if (this.noCoupon > window.scrollY) {
        this.scrolled = false
      }

      this.lastPosition = window.scrollY
    }
  }
}
</script>
