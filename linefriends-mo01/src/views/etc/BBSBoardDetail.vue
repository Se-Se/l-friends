<template>
  <div id="container" class="cs_notice">
    <sub-header :title="title" />
    <div class="notice_detail_wrap" v-if="bbsDatail">
      <h1 class="h1">
        {{bbsDatail.categoryLabel}} {{bbsDatail.title}}
      </h1>
      <table class=" date_and_number ft-1_2">
        <tbody>
          <tr>
            <td><span>LINE FRIENDS</span><span class="pl-0_4 num_font">{{bbsDatail.registerYmdt}}</span></td>
            <td class="text-right">
              閲覧数 <span class="ft-1_4 num_font">{{bbsDatail.viewCnt}}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-html="bbsDatail.content" class="long-text_area"/>
      <div class="cat_button">
        <button class="btn btn_primary size_m" @click="moveToList()">リスト</button>
      </div>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/header/SubHeader'
import { mapState } from 'vuex'
export default {
  name: 'NoticeDetail',
  components: {
    SubHeader
  },
  computed: {
    ...mapState('board', ['bbsDatail'])
  },
  data () {
    return {
      from: null,
      title: 'サポート'
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
