<template>
  <router-link :to="`/notice/detail/${notice.articleNo}`">
    <div
      class="notice-item"
    >
      <div class="notice-info">
        <p class="notice">
          {{ notice.categoryLabel }}
        </p>
      </div>
      <p class="notice__title">
        {{ notice.title }}
      </p>
      <p class="notice__manager">
        {{ $t('companyTitle') }}
      </p>
      <p class="notice__reg-dt">
        <span class="notice__reg-date">{{ notice.registerYmdt.split(' ').shift() }}</span>
        <span class="notice__reg-time">{{ notice.registerYmdt.split(' ').pop().substr(0,5) }}</span>
      </p>
      <p class="notice__button"></p>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'NoticeItem',
  props: {
    notice: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
    margin-bottom: 0.4rem;
    color: #333333;
    font-size: 1.4rem;
    font-family: 'Noto Sans KR';
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.01rem;
  &-item {
    position: relative;
    padding: 2rem 1.6rem 2.3rem 2rem;
    border-bottom: 1px solid #eeeeee;
  }
  &-info {
    display: flex;
    justify-content: space-between;
  }
  &__title {
    max-width: 30rem;
    margin-bottom: 1.5rem;
    color: #333333;
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__manager {
    display: inline-block;
    color: #666666;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    letter-spacing: -0.01rem;
    vertical-align: middle;
  }
  &__reg-dt {
    display: inline-block;
    padding-left: 1.8rem;
    font-size: 0;
    vertical-align: middle;
    > * {
      color: #666666;
      font-size: 1.4rem;
      font-weight: normal;
      letter-spacing: -0.01rem;
    }
  }
  &__reg-date {
    margin-right: 0.5rem;
  }
  &__button {
    position: absolute;
    top: 50%;
    right: 0;
    width: 2rem;
    height: 2rem;
    margin-right: 1.6rem;
    background-image: url(~@/assets/images/mobile/ic-small-down.svg);
    background-size: 100% 100%;
    transform: translateY(-50%) rotate(-90deg);
  }
}
</style>
