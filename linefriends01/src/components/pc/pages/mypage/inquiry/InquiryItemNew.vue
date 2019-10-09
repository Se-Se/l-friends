<template>
  <tbody class="line-1">
    <tr class="table-contact--item" @click.prevent="onClick">
      <td>
        <p class="table-contact--item__title title">
          {{ inquiryItem.inquiryType.inquiryTypeName }}
        </p>
      </td>
      <td class="text_left_sp1">
        <div class="ellipsis">
          <p class="table-contact--item__title inquiry">
            {{ inquiryItem.inquiryTitle }}
          </p>
        </div>
      </td>
      <td class="deafult-center">
        <p class="table-contact--item__title info">{{ showDate }} {{ showTime }}</p>
      </td>
      <td :class="{answer: !(inquiryItem.inquiryStatus === 'ASKED' || inquiryItem.inquiryStatus === 'IN_PROGRESS'), 'deafult-center': true}">
        <p :class="{txt_color_blue:(inquiryType === '답변완료')}">{{ inquiryType }}</p>
      </td>
    </tr>
    <tr v-if="currentIndex === index">
      <td colspan="5" class="contact-answer">
        <div class="contact-answer__content">
          <div class="contact-answer--info">
            <h2 class="contact-answer--info__title">
              {{inquiryItem.inquiryType.inquiryTypeName}}
            </h2>
            <p class="contact-answer--info__description">
              <more-view :content="inquiryItem.inquiryContent"></more-view>
            </p>
          </div>
          <div class="write_btm">
            <span class="txt_color_gray num">
              <template v-for="imgName in inquiryItem.originalImageUrls">
                <span v-for="(img, index) in inquiryItem.imageUrls" :key="index" @click.prevent="downloadIamge(img, imgName)">
                  {{imgName}}
                </span>
              </template>
            </span>
          </div>
        </div>
        <div class="bx_answer" v-if="currentIndex === index && inquiryItem.answer">
          <div class="write_wrapper">
            <span class="write_info">
              <span class="ico"></span>
              <span class="nickname">{{ $t('mypage.inquiry.answer') }}</span>
            </span>
            <p class="txt">
              <h-more-view :content="inquiryItem.answer.answerContent"></h-more-view>
            </p>
            <div class="write_btm">
              <span class="blind">{{ $t('mypage.inquiry.addDate') }} : </span>
              <span class="date">{{ answerDate }}</span>
              <span class="blind">{{ $t('mypage.inquiry.addTime') }} : </span>
              <span class="time">{{ answerTime }}</span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script>
import MoreView from '@/components/common/MoreView'
import HMoreView from '@/components/common/HTMLMoreView'
import InquiryItemNew from '@/components/mixins/mypage/inquiry/InquiryItemNew'
export default {
  mixins: [InquiryItemNew],
  components: {
    MoreView,
    HMoreView
  }
}
</script>
<style lang="scss" scoped>
.txt_color_gray {
  cursor: pointer;
}
.blind {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  font-size: 1px;
  line-height: 100px;
  white-space: nowrap;
}

.bx_answer {
  padding: 30px 20px 30px 20px;
  border-top: 1px solid #e6e6e6;
  background-color: #fafafa;
  .write_wrapper {
    width: 1055px;
    margin: 0 auto;
  }
  span {
    display: inline-block;
    vertical-align: middle;
  }
  .txt {
    padding-bottom: 10px;
    padding-left: 42px;
    font-family: "Noto Sans KR";
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.1px;
    font-size: 12px;
    color: #333333;
  }
  .write_info {
    display: block;
    margin-bottom: 16px;
    font-size: 14px;
    color: #969696;
    .ico {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 9px;
      background-image: url("/static/images/pc/icons/ic-answer-brown.svg");
      background-size: cover;
      border-radius: 50%;
    }
    .nickname {
      margin-right: 18px;
      font-family: "Noto Sans KR";
      font-size: 14px;
      color: #333333;
      font-weight: 500;
      letter-spacing: -0.14px;
      vertical-align: middle;
    }
  }
  .write_btm {
    padding-left: 40px !important;
    .date {
      margin-right: 7px;
      font-family: "Noto Sans KR";
      font-size: 12px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.1px;
      color: #999999;
    }
    .time {
      font-family: "Noto Sans KR";
      font-size: 12px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.1px;
      color: #999999;
    }
  }
}

.write_info .nickname.secret:after {
  display: inline-block;
  width: 13px;
  height: 16px;
  margin-left: 6px;
  background: url("~@/assets/images/payco/sp.png") no-repeat -116px -24px;
  vertical-align: middle;
  content: "";
  margin-top: -2px;
}
</style>
