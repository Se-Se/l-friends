<template>
  <div>
    <sub-page-header :title="$t('menu.inquiry')" />

    <div id="container">
      <div class="inquiry-button">
        <app-button
          size="middle-semi"
          @click="regist = true"
        >
          {{ $t('button.addInquiry') }}
        </app-button>
      </div>

      <inquiry-container />
    </div>

    <transition name="profile-inquiry-new">
      <div
        v-if="regist"
        class="profile-inquiry-new__wrapper"
      >
        <profile-inquiry-new
          ref="ProfileInquiryNew"
          class="profile-inquiry-new"
          @close="regist = false"
          @complete="updateList"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import $ from 'jquery'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { onScrollNextPage } from '@/utils/event-bus'
import { mapState } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppButton from '@/components/mobile/common/button/Button'
import InquiryContainer from '@/components/mobile/inquiry/InquiryContainer'

import ProfileInquiryNew from './ProfileInquiryNew'

const $elem = $('html, body')

export default {
  name: 'InquiryList',
  components: {
    SubPageHeader,
    AppButton,
    InquiryContainer,
    ProfileInquiryNew
  },
  data () {
    return {
      regist: false
    }
  },
  computed: {
    ...mapState('profileinquiry', ['inquiries', 'totalCount'])
  },
  watch: {
    regist (next) {
      if (next) {
        disablePageScroll(this.$refs.ProfileInquiryNew.$el)
        $elem.css('overflow', 'hidden')
      } else {
        enablePageScroll(this.$refs.ProfileInquiryNew.$el)
        $elem.css('overflow', '')
      }
    }
  },
  mounted () {
    onScrollNextPage(async () => {
      if (this.inquiries && this.inquiries.length < this.totalCount) {
        await this.$store.dispatch('profileinquiry/fetchInquiriesMore')
      }
    })
  },
  methods: {
    async updateList () {
      await this.$store.dispatch('profileinquiry/fetchInquiries')
      this.regist = false
    }
  }
}
</script>

<style lang="scss" scoped>
.inquiry-button {
  padding: 1.6rem 2rem 2rem;
}
.profile-inquiry-new {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  &__wrapper {
    position: fixed;
    z-index: 1005;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  &-enter-active, &-leave-active {
    transition: .3s;
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(5rem);
  }
}
</style>
