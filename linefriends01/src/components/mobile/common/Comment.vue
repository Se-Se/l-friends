<template>
  <p class="comment">
    <slot />
  </p>
</template>

<style lang="scss" scoped>
.comment {
  padding: 2rem 2rem 1.5rem;
  background: #fafafa;
  font-family: 'Noto Sans KR';
  font-size: 1.2rem;
  font-weight: normal;
  line-height: normal;
  letter-spacing: -0.01rem;
  color: #666;
}
</style>
