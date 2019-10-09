<template>
  <div>
    <sub-page-header title="공지사항"/>
    <div id="container">
      <div class="notice">
        <div class="notice-header">
          <div class="notice-header__title">
            <p>{{ bbsDatail.title }}</p>
          </div>
          <div class="notice-header__info">
            <div class="notice-header__ymdt">
              <p class="notice-header__manager">{{ $t('companyTitle') }}</p>
              <p class="notice-header__ymd">{{ bbsDatail.registerYmdt.split(' ').shift() }}</p>
              <p class="notice-header__time">
                {{ bbsDatail.registerYmdt.split(' ').pop().substr(0,5) }}
              </p>
            </div>
            <p class="notice-header__inquiry">조회수<em>{{ bbsDatail.viewCnt }}</em></p>
          </div>
        </div>
        <div class="notice-contents">
          <div
            class="notice-contents__textwrap"
            v-html="bbsDatail.content"
          />
          <div class="notice-contents__btn">
            <app-button
              size="middle-small"
              @click="moveToList()"
            >
              목록
            </app-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppButton from '@/components/mobile/common/button/Button'
import filters from '@/filters/index'

export default {
  name: 'NoticeDetail',
  components: {
    SubPageHeader,
    AppButton
  },
  computed: {
    ...mapState('board', ['bbsDatail', 'bbsEditAble', 'bbs404']),
    ...mapState('profile', ['profile']),
    contentWords () {
      return this.content.length
    }
  },
  data () {
    return {
      from: null
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => { vm.from = from })
  },
  methods: {
    moveToList () {
      if (this.from && this.from.name === 'BBSBoard') {
        this.$router.go(-1)
      } else {
        this.$router.push({
          name: 'BBSBoard'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notice{
  &-header{
    padding: 2rem;
    border-bottom: 1px solid #eeeeee;
    &__title{
      padding-bottom: 1.67rem;
      color: #333333;
      font-size: 1.6rem;
      font-family: 'Noto Sans KR';
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.01rem;
    }
    &__info{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &__manager{
      color: #666666;
      font-size: 1.4rem;
      font-family: 'Noto Sans KR';
      font-weight: normal;
      line-height: normal;
      letter-spacing: -0.01rem;
    }
    &__ymdt{
      display: flex;
      align-items: center;
      color: #666666;
      font-size: 1.4rem;
      font-weight: normal;
      line-height: normal;
      letter-spacing: -0.01rem;
    }
    &__ymd{
      padding-left: 1.8rem
    }
    &__time{
      padding-left: 0.5rem
    }
    &__inquiry{
      color: #666666;
      font-size: 1.4rem;
      font-family: 'Noto Sans KR';
      font-weight: normal;
      line-height:  normal;
      letter-spacing: -0.01rem;
      em{
        padding-left: 0.5rem;
        font-size: 1.4rem;
      }
    }
  }
  &-contents{
    padding: 2rem 2rem 4rem;
    &__textwrap{
      margin-bottom: 3.7rem;
    }
    &__text{
      color: #333333;
      font-size: 1.4rem;
      font-family: 'Noto Sans KR';
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.01rem;
    }
    &__text:nth-child(5){
      text-decoration: underline;
    }
    &__text:nth-child(6){
      text-decoration: underline;
    }
  }
}
</style>
