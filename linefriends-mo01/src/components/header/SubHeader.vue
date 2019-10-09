<template>
  <div class="wrap_category">
      <div class="category_left" >
        <a @click.prevent="goBack()" class="btn_back">Back</a>
      </div>
      <h2>{{title}}</h2>
    </div>
</template>
<script>
export default {
  props: ['title', 'subSubHeader'],
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
