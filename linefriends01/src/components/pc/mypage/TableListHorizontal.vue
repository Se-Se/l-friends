<template>
  <div class="horizontal">
    <div class="horizontal__header">
      <h2 class="horizontal__header--title">
        {{ title }}
      </h2>
      <a
        v-if="data.mode === 'delivery'"
        href="#"
        class="horizontal__header--more"
      >{{ $t('delivery.deliveryChange') }}</a>
    </div>
    <table class="horizontal__tbl">
      <colgroup>
        <col
          style="width:20%"
          span="1"
        >
        <col
          style="width:80%"
          span="1"
        >
      </colgroup>
      <tbody>
        <tr>
          <td v-if="data.mode === 'buyer'">
            {{ $t('orderInfo.buyer') }}
          </td>
          <td v-else-if="data.mode === 'delivery'">
            {{ $t('orderInfo.recipient') }}
          </td>
          <td>{{ data.name }}</td>
        </tr>
        <tr v-if="data.mode === 'buyer'">
          <td>{{ $t('myInfo.email') }}</td>
          <td>{{ data.email }}</td>
        </tr>
        <tr v-else-if="data.mode === 'delivery'">
          <td>{{ $t('mall.address') }}</td>
          <td>{{ data.address }}</td>
        </tr>
        <tr>
          <td>{{ $t('mall.phone') }}</td>
          <td>{{ data.phone }}</td>
        </tr>
        <tr v-if="data.mode === 'delivery'">
          <td>{{ $t('mall.memo') }}</td>
          <td>{{ data.memo }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'TableListHorizontal',
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  }
}
</script>
