<template>
  <tbody class="line-1" :class="[inquiry.answers === null?unfinish:finish]">
    <tr class="table-contact--item">
      <td @click.prevent="onClick" :class="[inquiry.answers === null?unfinish:finish]">
        <p class="table-contact--item__title title">
          {{ inquiryType(inquiry.type) }}
        </p>
      </td>
      <td @click="product(inquiry.productNo)" :class="[inquiry.answers === null?unfinish:finish]">
        <div class="ellipsis">
          <p class="table-contact--item__title text_left table-contact--ellipse">
            {{ inquiry.productName }}
          </p>
        </div>
      </td>
      <td class="text_left_sp1" @click.prevent="onClick" :class="[inquiry.answers === null?unfinish:finish]">
        <!-- [D] 비공개 문의 유형 : a에 secret 클래스 추가 -->
        <div class="ellipsis">
          <p class="table-contact--item__title text_left">
            <a href="javascript:" class="subject" :class="{secret: inquiry.secreted}">
              <span class="table-contact--item__secret"><img src="~@/assets/images/pc/icons/ic-lock.svg" alt=""></span>
              <span class="max-width__text" :class="{ico_secret:inquiry.secreted}">{{ inquiry.content }}</span>
            </a>
          </p>
        </div>
      </td>
      <td @click.prevent="onClick" :class="[inquiry.answers === null?unfinish:finish]">
        <p class="table-contact--item__title info">
          {{ inquiry.registerYmdt.split(' ')[0].replace(/-/g,'.') }}&nbsp;{{ inquiry.registerYmdt.split(' ')[1].substring(0, 5) }}
        </p>
      </td>
      <template v-if="inquiry.answers === null">
        <td @click.prevent="onClick" class="cursor-pointer">
          <p class="table-contact--item__title info cursor-pointer">답변대기</p>
        </td>
      </template>
      <template v-else>
        <td class="answer cursor-pointer" @click.prevent="onClick">
          <p class="table-contact--item__title finish cursor-pointer">답변완료</p>
        </td>
      </template>
    </tr>
    <!--뷰모드-->
    <template v-if="currentIndex === index">
      <template v-if="mode === 'VIEW'">
        <tr>
          <td class="contact-answer" :class="[inquiry.answers === null?notAnswer:'']" colspan="5">
            <div class="contact-answer__content">
              <div class="contact-answer--info">
                <h2 class="contact-answer--info__title">
                  {{inquiryType(inquiry.type)}}
                </h2>
                <p class="contact-answer--info__description">
                  <pre>{{ inquiry.content }}</pre>
                </p>
              </div>
              <div v-if="inquiry.modifiable" class="contact-answer--actions">
                <white-button :data="form.update" @click="mode = 'MODIFY'" />
                <white-button :data="form.delete" @click="deleteInquiry(inquiry.inquiryNo)" />
              </div>
            </div>
          </td>
        </tr>
      </template>
      <!--수정모드-->
      <template v-if="inquiry.modifiable && mode === 'MODIFY'">
        <tr>
          <td class="contact-answer" colspan="5">
            <div class="contact-answer__content">
              <div class="contact-answer--info">
                <h2 class="contact-answer--info__title" :class="{secret:inquiry.secreted}">
                  {{inquiryType(inquiry.type)}}
                </h2>
                <div class="contact-modify">
                  <div class="contact-modify__radios">
                    <span class="switch-wrapper">
                      <input type="radio" :name="`group_qna_${inquiry.inquiryNo}`" value="PRODUCT" :id="`qna_product_${inquiry.inquiryNo}`" checked="" v-model="savedInquiry.type" class="switch-input">
                      <label :for="`qna_product_${inquiry.inquiryNo}`" class="switch-label">
                        <span class="switch-label__action">{{ inquiry.inquiryNo }}</span>
                        <p :class="{
                            'switch-label__title': true,
                            '_bold': true
                          }">
                          상품
                        </p>
                      </label>
                    </span>
                    <!-- <span class="switch-wrapper">
                      <input type="radio" :name="`group_qna_${inquiry.inquiryNo}`" value="DELIVERY" :id="`qna_delivery_${inquiry.inquiryNo}`" v-model="savedInquiry.type" class="switch-input">
                      <label :for="`qna_delivery_${inquiry.inquiryNo}`" class="switch-label">
                        <span class="switch-label__action">{{ inquiry.inquiryNo }}</span>
                        <p :class="{
                            'switch-label__title': true,
                            '_bold': true
                          }">
                          배송
                        </p>
                      </label>
                    </span>
                    <span class="switch-wrapper">
                      <input type="radio" :name="`group_qna_${inquiry.inquiryNo}`" value="CANCEL" :id="`qna_cancel_${inquiry.inquiryNo}`" v-model="savedInquiry.type" class="switch-input">
                      <label :for="`qna_cancel_${inquiry.inquiryNo}`" class="switch-label">
                        <span class="switch-label__action">{{ inquiry.inquiryNo }}</span>
                        <p :class="{
                            'switch-label__title': true,
                            '_bold': true
                          }">
                          취소
                        </p>
                      </label>
                    </span>
                    <span class="switch-wrapper">
                      <input type="radio" :name="`group_qna_${inquiry.inquiryNo}`" value="RETURN" :id="`qna_return_${inquiry.inquiryNo}`" v-model="savedInquiry.type" class="switch-input">
                      <label :for="`qna_return_${inquiry.inquiryNo}`" class="switch-label">
                        <span class="switch-label__action">{{ inquiry.inquiryNo }}</span>
                        <p :class="{
                            'switch-label__title': true,
                            '_bold': true
                          }">
                          반품
                        </p>
                      </label>
                    </span>
                    <span class="switch-wrapper">
                      <input type="radio" :name="`group_qna_${inquiry.inquiryNo}`" value="EXCHANGE" :id="`qna_change_${inquiry.inquiryNo}`" v-model="savedInquiry.type" class="switch-input">
                      <label :for="`qna_change_${inquiry.inquiryNo}`" class="switch-label">
                        <span class="switch-label__action">{{ inquiry.inquiryNo }}</span>
                        <p :class="{
                            'switch-label__title': true,
                            '_bold': true
                          }">
                          교환
                        </p>
                      </label>
                    </span>
                    <span class="switch-wrapper">
                      <input type="radio" :name="`group_qna_${inquiry.inquiryNo}`" value="REFUND" :id="`qna_refund_${inquiry.inquiryNo}`" v-model="savedInquiry.type" class="switch-input">
                      <label :for="`qna_refund_${inquiry.inquiryNo}`" class="switch-label">
                        <span class="switch-label__action">{{ inquiry.inquiryNo }}</span>
                        <p :class="{
                            'switch-label__title': true,
                            '_bold': true
                          }">
                          환불
                        </p>
                      </label>
                    </span>
                    <span class="switch-wrapper">
                      <input type="radio" :name="`group_qna_${inquiry.inquiryNo}`" value="OTHER" :id="`qna_etc_${inquiry.inquiryNo}`" v-model="savedInquiry.type" class="switch-input">
                      <label :for="`qna_etc_${inquiry.inquiryNo}`" class="switch-label">
                        <span class="switch-label__action">{{ inquiry.inquiryNo }}</span>
                        <p :class="{
                            'switch-label__title': true,
                            '_bold': true
                          }">
                          기타
                        </p>
                      </label>
                    </span> -->
                  </div>
                  <div class="contact-modify__area">
                    <form @submit.prevent>
                      <fieldset>
                        <div class="contact-modify__area">
                          <textarea v-model="savedInquiry.content" maxlength="1000" :placeholder="$t('mypage.productinquiry.placeholder.pc.content')"></textarea>
                          <span class="status-textnumber">
                            <span class="status-textnumber__num">{{ priceFormat(savedInquiry.content.length) }}</span>
                            <span class="status-textnumber__total">/1,000</span>
                          </span>
                        </div>
                        <div class="contact-answer--actions">
                          <div class="contact-answer--actions__chk">
                            <input id="personal2" ref="checkbox" type="checkbox" :disabled="true" class="switch-input" v-model="savedInquiry.secreted">
                            <label for="personal2" class="switch-label">
                              <span class="switch-label__action checkbox">{{ savedInquiry.secreted }}</span>
                              <p :class="{
                                    'switch-label__title': true
                                  }">
                                비공개
                              </p>
                            </label>
                          </div>
                          <div>
                            <white-button :data="form.update" @click="putInquiry" />
                            <white-button :data="form.cancel" @click="goViewMode" />
                          </div>
                        </div>
                      </fieldset>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </template>
      <!--답글-->
      <template v-for="(answer,index) in inquiry.answers">
        <tr :key="index">
          <td class="contact-answer finish-answer" colspan="5">
            <div class="contact-answer__content">
              <div class="contact-answer--info">
                <h2 class="contact-answer--info__title finish-answer__title answer">
                  {{answer.adminType === 'SERVICE'?'라인프렌즈 답변':'파트너사 답변'}}
                </h2>
                <p class="contact-answer--info__description answer">
                  {{ answer.content }}
                </p>
                <p class="finish-answer__date">
                  {{ answer.updateYmdt.split(' ')[0].replace(/-/g,'.') }}
                  {{ answer.updateYmdt.split(' ')[1].substring(0, 5) }}
                </p>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </template>
  </tbody>
</template>
<script>
import MoreView from '@/components/common/MoreView'
import WhiteButton from '../../../../assets/buttons/WhiteButton'
import SwitchItem from '../../../../assets/Switch'
import ProductInquiryCardNew from '@/components/mixins/mypage/productinquiry/leaf/ProductInquiryCardNew'

export default {
  data () {
    return {
      unfinish: 'cursor-pointer',
      finish: 'cursor-pointer',
      notAnswer: 'contact-unanswer'
    }
  },
  mixins: [ProductInquiryCardNew],
  components: {
    MoreView,
    WhiteButton,
    SwitchItem
  }
}
</script>
<style scoped>
.cursor {
  cursor: default;
}
.cursor-pointer {
  cursor: pointer;
}
#wrap.pc .contact-answer.contact-unanswer {
  background-color: #ffffff;
}
</style>

