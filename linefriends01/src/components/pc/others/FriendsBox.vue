<template>
  <div class="friends-box">
    <div class="friends-box__wrapper">
      <div class="friends-box__header">
        <figure
          class="friends-box__header-fig"
          :style="{width: (friend.figureWidth) + 'px'}"
        >
          <img
            :src="friend.charImage"
          >
        </figure>
      </div>
      <div class="friends-box__info">
        <dl class="friends-box__info-wrapper">
          <dt class="friends-box__info-header">
            <figure
              class="friends-box__info-title"
              :style="{width: (friend.titleWidth) + 'px'}"
            >
              <img
                :src="friend.chartitle"
              >
            </figure>
            <p class="friends-box__info-status">{{friend.status}}</p>
          </dt>
          <dd
            v-html="friend.guide"
            class="friends-box__info-guide"
          />
          <dd class="friends-box__info-more">
            <router-link :to="friend.path">
              상품 더보기<em></em>
            </router-link>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FriendsBox',
  props: {
    friend: {
      type: Object,
      required: true
    }
  }
}
</script>
