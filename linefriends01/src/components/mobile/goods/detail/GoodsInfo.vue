<template>
  <div id="container">
    <div class="goods-info__wrapper">
      <div class="partner-notice" v-if="product.partnerNotice">
        <div class="partner-notice__content" v-html="product.partnerNotice.content" />
      </div>
      <div v-if="product.baseInfo.contentHeader" class="goods-info__header" v-html="product.baseInfo.contentHeader" />
      <div class="goods-info" v-html="product.baseInfo.content" />
      <div v-if="product.baseInfo.contentFooter" class="goods-info__footer" v-html="product.baseInfo.contentFooter" />
      <div class="goods-info-table__wrapper">
        <span class="goods-info__label">상품정보</span>
        <table class="goods-info-table">
          <tbody>
            <tr v-for="(item, key) in baseInfo" :key="key">
              <th>{{ Object.keys(item)[0] }}</th>
              <td>
                <pre class="goods-info-table__pre">{{ Object.values(item)[0] }}</pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="deliveryCustomerInfo" class="goods-info-notice__wrapper">
        <span class="goods-info__label">취급 시 주의사항</span>
        <ul class="goods-info-notice">
          <li v-for="(info, key) in deliveryCustomerInfo" :key="key" class="goods-info-notice__item">
            {{ info }}
          </li>
        </ul>
      </div>
    </div>
    <template v-if="recommands&&recommands.length!=0">
      <main-article title="이 상품은 어때요?" background="#f6f6f6" :padding-side="0" left>
        <goods-list :padding-side="2" :width="19.4" direction="horizontal" skin="box" :goods="recommands" />
      </main-article>
    </template>
  </div>
</template>

<script>
import MainArticle from '@/components/mobile/main/MainArticle'
import GoodsList from '@/components/mobile/goods/GoodsList'
import { mapState } from 'vuex'

export default {
  name: 'GoodsInfo',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('productrecommand', { recommands: 'list' }),
    baseInfo () {
      const baseInfoJSON = this.product.baseInfo.baseInfoByJSON
      const contents = (baseInfoJSON && baseInfoJSON.contents) || {}
      return this.product ? contents : {}
    },
    deliveryCustomerInfo () {
      return this.product.deliveryFee && this.product.deliveryFee.deliveryCustomerInfo ? this.product.deliveryFee.deliveryCustomerInfo.split('\n') : null
    }
  },
  components: {
    MainArticle,
    GoodsList
  }
}
</script>

<style lang="scss" scoped>
/deep/ .goods-info {
  font-family: "Noto Sans KR";
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 1.5;
  letter-spacing: -0.01rem;
  color: #666666;

  &__wrapper {
    padding: 2rem 2rem 8rem;
  }

  &__footer {
    padding-bottom: 4rem;
  }

  &__label {
    font-family: "Noto Sans KR";
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1.5;
    color: #333;
  }

  &-table {
    width: 100%;
    margin-top: 0.6rem;
    margin-bottom: 3.2rem;
    border-bottom: 1px solid #eee;

    td,
    th {
      border-top: 1px solid #eee;
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: normal;
      line-height: 1.5;
      color: #666;
      padding: 0.8rem 0.8rem 0.8rem 1.2rem;
      text-align: left;
    }

    th {
      width: 11.2rem;
      background: #fafafa;
      font-weight: 500;
      padding-right: 1.2rem;
    }
    &__pre {
      white-space: pre-wrap;
    }
  }

  &-notice {
    padding-left: 1rem;

    &__item {
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.01rem;
      color: #666;
    }
  }

  img,
  video,
  iframe {
    width: 100%;
    height: auto;
  }

  .margin10 {
    margin: 10px 0;
  }
  .margin_t10 {
    margin-top: 10px;
  }
  .margin_b10 {
    margin-bottom: 10px;
  }

  .margin20 {
    margin: 20px 0;
  }
  .margin_t20 {
    margin-top: 20px;
  }
  .margin_b20 {
    margin-bottom: 20px;
  }

  .margin_b25 {
    margin-bottom: 25px;
  }

  .margin30 {
    margin: 30px 0;
  }
  .margin_t30 {
    margin-top: 30px;
  }
  .margin_b30 {
    margin-bottom: 30px;
  }

  .margin40 {
    margin: 40px 0;
  }
  .margin_t40 {
    margin-top: 40px;
  }
  .margin_b40 {
    margin-bottom: 40px;
  }

  .margin50 {
    margin: 50px 0;
  }
  .margin_t50 {
    margin-top: 50px;
  }
  .margin_b50 {
    margin-bottom: 50px;
  }

  .margin60 {
    margin: 60px 0;
  }
  .margin_t60 {
    margin-top: 60px;
  }
  .margin_b60 {
    margin-bottom: 60px;
  }

  .margin70 {
    margin: 70px 0;
  }
  .margin_t70 {
    margin-top: 70px;
  }
  .margin_b70 {
    margin-bottom: 70px;
  }

  .margin80 {
    margin: 80px 0;
  }
  .margin_t80 {
    margin-top: 80px;
  }
  .margin_b80 {
    margin-bottom: 80px;
  }

  .margin90 {
    margin: 90px 0;
  }
  .margin_t90 {
    margin-top: 90px;
  }
  .margin_b90 {
    margin-bottom: 90px;
  }

  .margin100 {
    margin: 100px 0;
  }
  .margin_t100 {
    margin-top: 100px;
  }
  .margin_b100 {
    margin-bottom: 100px;
  }

  .margin110 {
    margin: 100px 0;
  }
  .margin_t110 {
    margin-top: 100px;
  }
  .margin_b110 {
    margin-bottom: 100px;
  }

  .margin120 {
    margin: 100px 0;
  }
  .margin_t120 {
    margin-top: 100px;
  }
  .margin_b120 {
    margin-bottom: 100px;
  }

  .margin130 {
    margin: 100px 0;
  }
  .margin_t130 {
    margin-top: 100px;
  }
  .margin_b130 {
    margin-bottom: 100px;
  }

  .margin140 {
    margin: 100px 0;
  }
  .margin_t140 {
    margin-top: 100px;
  }
  .margin_b140 {
    margin-bottom: 100px;
  }

  .margin150 {
    margin: 100px 0;
  }
  .margin_t150 {
    margin-top: 100px;
  }
  .margin_b150 {
    margin-bottom: 100px;
  }

  .margin160 {
    margin: 100px 0;
  }
  .margin_t160 {
    margin-top: 100px;
  }
  .margin_b160 {
    margin-bottom: 100px;
  }

  .margin170 {
    margin: 100px 0;
  }
  .margin_t170 {
    margin-top: 100px;
  }
  .margin_b170 {
    margin-bottom: 100px;
  }

  .margin180 {
    margin: 100px 0;
  }
  .margin_t180 {
    margin-top: 100px;
  }
  .margin_b180 {
    margin-bottom: 100px;
  }

  .margin190 {
    margin: 100px 0;
  }
  .margin_t190 {
    margin-top: 100px;
  }
  .margin_b190 {
    margin-bottom: 100px;
  }

  .margin200 {
    margin: 100px 0;
  }
  .margin_t200 {
    margin-top: 100px;
  }
  .margin_b200 {
    margin-bottom: 100px;
  }

  .textstyle {
    text-align: center;
  }

  .detail_heading {
    display: block;
    font-family: "Noto Sans KR";
    color: #333;
    font-size: 2.4rem;
    line-height: 1.33;
    font-weight: bold;
    margin-bottom: 1.2rem;
  }

  .detail_title {
    display: block;
    margin: 0 0 11px;
    font-size: 24px;
    line-height: 25px;
    color: #333;
  }

  .img_list li {
    margin-top: 20px;
  }

  .img_list li:first-child {
    margin-top: 0;
  }

  b {
    font-weight: bold;
  }
}

.goods-info,
.goods-info__footer,
.goods-info__header {
  /deep/ .detail-info {
    &__size {
      margin-top: 6rem;
      margin-bottom: 7.4rem;
      word-break: break-all;
      &-wrapper {
        word-break: break-all;
      }
      &_title {
        margin: 0 0 0.4rem;
        color: #323232;
        font-size: 1.8rem;
        font-family: "Noto Sans KR";
        font-weight: bold;
        line-height: 2.2rem;
        text-align: left;
      }
      &_img {
        margin-bottom: 3.8rem;
        word-break: break-all;
      }
      &_name {
        display: block;
        padding: 0 0 0.7rem;
        text-align: left;
        color: #323232;
        font-size: 1.2rem;
        font-family: "Noto Sans KR";
        font-weight: bold;
        word-break: break-all;
      }
      &_wrap {
        background-color: #fafafa;
        word-break: break-all;
      }
      &_thumb {
        display: block;
        word-break: break-all;
      }
      &_panel {
        margin-bottom: 3.8rem;
        word-break: break-all;
      }
      &_table {
        border: 1px solid #f4f5f7;
        border-width: 1px 0;
        width: 100%;
        font-size: 1.2rem;
        font-family: "Noto Sans KR";
        line-height: 1.7rem;
        text-align: center;
        table-layout: fixed;
        border-collapse: collapse;
        &.v2 {
          td {
            color: #a5aab0;
            b {
              font-weight: bold;
              color: #00d664;
            }
          }
        }
        tr {
          th {
            height: auto;
            padding: 1rem 0;
            color: #878b8f;
            background-color: #fafafa;
            border-bottom: 1px solid #f4f5f7;
            -webkit-box-sizing: border-box;
            white-space: nowrap;
            font-family: "Noto Sans KR";
            font-weight: normal;
          }
          td {
            color: #333333;
            height: 4rem;
            line-height: 4rem;
            border-bottom: 1px solid #f4f5f7;
            font-family: "Noto Sans KR";
            font-weight: normal;
            -webkit-box-sizing: border-box;
            white-space: nowrap;
            &:first-child {
              color: #878b8f;
              background-color: #fafafa;
            }
          }
        }
      }
      &_notice {
        margin-top: 0.9rem;
        margin-bottom: -0.5rem;
        color: #878b8f;
        font-size: 1.2rem;
        text-align: left;
        line-height: 1.8rem;
      }
      &-review {
        width: 100%;
      }
    }
    &__staff {
      position: relative;
      border: 1px solid #eee;
      padding: 2.5rem 3.1rem 2.3rem;
      margin-top: 1.2rem;
      &:first-child {
        margin-top: 0;
      }
      &-area {
        text-align: left;
      }
      &-area_1 {
        font-size: 1.6rem;
        color: #333333;
      }
      &-guide {
        font-family: "Noto Sans KR";
        font-size: 1.4rem;
        line-height: 2.1rem;
        color: #333333;
        text-align: left;
      }
      &-area_2 {
        margin-top: 3.2rem;
      }
      &_info {
        display: block;
        margin-top: 0.3rem;
        font-size: 1.4rem;
        color: #878b8f;
        font-family: "Volte", "Noto Sans KR", sans-serif;
        font-weight: 600;
        line-height: 1.8rem;
        &.review {
          color: #333333;
        }
      }
      &-height {
        display: block;
        margin-top: 0.3rem;
      }
      &-thumb {
        display: block;
        position: absolute;
        bottom: 2.4rem;
        right: 2.4rem;
        overflow: hidden;
        vertical-align: top;
        background: url(/static/images/pc/size/line_staff.png) no-repeat;
        background-size: 25rem 15.2rem;
        color: transparent;
        width: 8rem;
        height: 7.2rem;
        &.staff-a {
          background-position: 0 -7.9rem;
        }
        &.staff-b {
          background-position: -8.5rem -7.9rem;
        }
        &.staff-c {
          height: 7.8rem;
          background-position: -17rem -7.3rem;
        }
        &_friends {
          display: block;
          position: absolute;
          bottom: 2.4rem;
          right: 2.4rem;
          overflow: hidden;
          vertical-align: top;
          background: url(/static/images/pc/size/line_staff.png) no-repeat;
          background-size: 25rem 15.2rem;
          color: transparent;
          width: 8rem;
          height: 7.2rem;
          &.staff-a {
            background-position: 0 0;
          }
          &.staff-b {
            background-position: -8.5rem 0;
          }
          &.staff-c {
            background-position: -17rem 0;
          }
        }
        .blind {
          overflow: hidden;
          position: absolute;
          width: 0.1rem;
          height: 0.1rem;
          margin: -0.1rem;
          clip: rect(0 0 0 0);
        }
      }
    }
  }
}

/deep/.partner-notice {
  &__content {
    padding-bottom: 1.3rem;
    font-size: 1.4rem;
    line-height: 1.5;
  }
}
</style>
