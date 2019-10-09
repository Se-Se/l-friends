<template>
  <div class="order_detail_table">
    <h1 v-if="type === 'cancel'">キャンセルの理由</h1>
    <h1 v-else>返品する理由</h1>
    <table class="table_data have_padding">
      <tbody>
        <tr>
          <th>理由</th>
          <td>
            <div class="cancel_reasons">
              <vue-select-box class="size_m" :showValue="claimReasonType" :items="typeList" @selected="selectType" />
              <!-- <p class="reasons-notes">返送料はお客様ご負担となります。</p> -->
            </div>
          </td>
        </tr>
        <tr>
          <th>内容</th>
          <td>
            <div class="cancel_area">
              <textarea v-model="claimReasonDetail" placeholder="詳しい理由を入力してください。" maxlength="160"></textarea>
            </div>
          </td>
        </tr>
        <!-- <tr v-if="type === 'return'">
          <th>添付</th>
          <td>
            <div class="cancel_att">
              <button class="btn btn_primary size_m">ファイル選択</button>
              <p class="reasons-notes">最大5件までアップロードできます。</p>
            </div>
          </td>
        </tr> -->
      </tbody>
    </table>
  </div>
</template>

<script>
import VueSelectBox from '@/components/common/VueSelectBox'

export default {
  props: ['claimOrderOption', 'options', 'type'],
  data: function () {
    return {
      claimReasonType: 'default',
      claimReasonDetail: ''
    }
  },
  computed: {
    typeList () {
      let list = [{
        label: '選択してください',
        value: 'default'
      }]
      if (this.claimOrderOption && this.claimOrderOption.claimReasonTypes && this.claimOrderOption.claimReasonTypes.length) {
        this.claimOrderOption.claimReasonTypes.forEach(option => {
          if (!(this.type === 'return' && option.claimReasonType === 'CHANGE_MIND')) {
            list.push({
              label: option.label,
              value: option.claimReasonType
            })
          }
        })
      }
      return list
    },
    reasonInfo () {
      return {
        claimReasonType: this.claimReasonType,
        claimReasonDetail: this.claimReasonDetail
      }
    }
  },
  methods: {
    selectType (value) {
      this.claimReasonType = value
      this.$nextTick(() => {
        this.$emit('estimate')
      })
    },
    checkReason () {
      if (this.claimReasonType === 'default') {
        return '理由を選択してください。'
      } else {
        return ''
      }
    }
  },
  components: {
    VueSelectBox
  }
}
</script>
