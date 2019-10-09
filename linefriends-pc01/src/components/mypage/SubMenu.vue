<template>
  <div class="wrap_category">
    <ul class="wrap_category_list">
      <li>
        <router-link to="/">ホーム</router-link>
      </li>
      <li>{{title}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>
