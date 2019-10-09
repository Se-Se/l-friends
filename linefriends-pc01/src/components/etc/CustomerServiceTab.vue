<template>
  <div class="menu_wrap">
    <ul class="nav_menu">
      <li :class="{'active':activeType === 'faq'}">
        <router-link to="/etc/faq">FAQ</router-link>
      </li>
      <li :class="{'active':activeType === 'inquiry'}">
        <router-link to="/etc/inquiry">1：1お問い合わせ</router-link>
      </li>
      <li :class="{'active':activeType === 'notice'}">
        <router-link to="/etc/notice">お知らせ</router-link>
      </li>
    </ul>
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'CustomerServiceTab',
  props: ['activeType']
}
</script>
