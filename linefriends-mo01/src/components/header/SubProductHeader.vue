<template>
  <div class="wrap_category">
    <div class="category_left"><a class="btn_back" @click="goBack()" v-if="showBack">Back</a></div>
    <h2>{{title}}</h2>
    <template v-if="showClose">
      <div class="category_right">
        <a href="#" class="btn_close" @click.prevent="emitClose"></a>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { isLogin } from '@/utils/utils'
export default {
  name: 'SubProductHeader',
  props: ['showClose', 'title', 'showBack'],
  computed: {
    ...mapGetters('product', ['product'])
  },
  data () {
    return {
      like: false
    }
  },
  methods: {
    ...mapActions('likeProducts', ['postLikeProducts']),
    ...mapMutations('product', ['CHANGELIKED']),
    async toggleLike () {
      if (!isLogin()) {
        this.$router.push('/m/member/login')
      } else {
        try {
          await this.postLikeProducts([this.product.baseInfo.productNo])
          this.CHANGELIKED()
        } catch (e) {
          console.log(e)
        }
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
