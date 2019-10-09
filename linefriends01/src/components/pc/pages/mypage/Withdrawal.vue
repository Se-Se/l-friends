<template>
  <div class="my-info">
    <main-wrapper :main="true">
      <layout-width>
        <div class="table-list--header">
          <h2 class="table-list--header__title">
          회원탈퇴
          </h2>
        </div>
        <table class="my-info-table">
          <tbody>
            <tr>
              <td class="hack">
                <div class="hack-title">서비스를 이용하시는데 불편함이 있으셨나요?</div>
                <ul>
                  <li>쇼핑몰에서 발송하는 쇼핑혜택알림은
                    <router-link to="/mypage/profile">마이페이지 &gt;정보수정</router-link>에서 수신거부 할 수 있습니다.</li>
                  <li>이용 불편 및 각종 문의 사항은
                    <span>고객센터(<i class="num">1544-5921</i>)</span> 또는
                    <router-link to="/mypage/inquiry">
                      <i class="num">1:1</i>문의</router-link>로 문의 해 주시면 성심 성의껏 답변 드리겠습니다.
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="hack">
                <div class="hack-title">탈퇴 시 유의사항</div>
                <ul>
                  <li>회원탈퇴 시 회원전용 서비스 이용은 불가능합니다. <span class="active-red">보유하셨던 쿠폰 등 회원 전용 혜택은</span>탈퇴와 함께 삭제되며 복구되지 않습니다.</li>
                  <li>주문내역이 있는 경우, 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 계약 또는 청약철회에 관한 기록, 대금결제 및 재화 등의 공급에 관한 기록은 탈퇴 후 5년 동안 보존됩니다.</li>
                  <li style="font-weight:bold">고객센터 또는 1:1 문의를 통한 고객상담 기록이 있는 경우, 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 소비자의 불만 또는 분쟁처리에 관한 기록은 탈퇴 후 3년간 보존됩니다.</li>
                  <li>탈퇴 완료 시 회원님의 개인정보는 삭제되지만 회원일 때 작성하였던 상품문의 및 상품평은 삭제되지 않습니다. 상품문의 및 상품평 삭제를 원하실 경우 먼저 게시물을 삭제하신 후 탈퇴를 신청하시기 바랍니다.</li>
                  <li>회원탈퇴 시 일주일간 동일한 아이디로 재 가입 불가합니다. 탈퇴를 요청하시기 전에 주문 상품의 구매 절차가 완료되지 않은 경우 불이익은 회원님이 부담하셔야 함을 유의해 주시기 바랍니다.</li>
                </ul>
                <p class="my-info__footer-title" style="margin-top:10px">
                  <switch-item
                    type="checkbox"
                    name="hack"
                    title="탈퇴 시 유의사항을 모두 확인하였으며 동의합니다."
                    v-model="agree"
                    @change="changeAgree"
                  />
                </p>
              </td>
            </tr>
            <tr>
              <td class="hack">
                <div class="hack-title">남기고 싶은 의견이 있으시면 기재해 주세요. (선택)</div>
                <div class="hack-textarea">
                  <textarea placeholder="이곳에 의견을 남겨주세요." v-model="opinion" style="width:100%" maxlength="100"></textarea>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="my-info__footer">
          <div class="my-info__btn">
            <default-btn :data="btn.cancel" @click="goProfile"/>
            <default-btn :data="btn.submit" @click="submit"/>
          </div>
        </div>
      </layout-width>
    </main-wrapper>
  </div>
</template>
<style scoped>
  .my-info-table td.hack {
    padding: 40px 10px 20px 10px!important;
  }
  .hack li {
    list-style:none;
    margin:10px 0;
    font-size:14px;
    line-height:15px;
  }
  .hack-title {
    margin-bottom:20px;
    font-size:18px;
    font-weight:bold;
  }
  .hack-textarea textarea {
    width: 100%;
    height: 200px;
    padding: 15px 20px;
    font-family: 'Noto Sasn KR';
    font-size: 14px;
    border: 1px solid #ededed;
    border-radius: 4px;
    background-color: #ffffff;
  }
  a {
    color: #4ba4d9;
    text-decoration: underline;
  }
</style>
<script>
import LayoutWidth from '../../layout/common/LayoutWidth'
import MainWrapper from '../../layout/common/MainWrapper'
import SwitchItem from '../../assets/Switch'
import DefaultBtn from '../../assets/buttons/DefaultButton'
import { logoutRemoveCookie } from '@/utils/utils'

import Withdrawal from '@/components/mixins/mypage/Withdrawal'

export default {
  name: 'Withdrawal',
  mixins: [Withdrawal],
  components: {
    LayoutWidth,
    MainWrapper,
    SwitchItem,
    DefaultBtn
  },
  data () {
    return {
      btn: {
        cancel: {
          action: 'button',
          to: '',
          title: this.$t('mypage.withdrawal.button.cancel'),
          type: 'half',
          active: false
        },
        submit: {
          action: 'button',
          to: '',
          title: this.$t('mypage.withdrawal.button.ok'),
          type: 'half',
          active: true
        }
      }
    }
  },
  methods: {
    changeAgree (e) {
      this.agree = e.target.checked
    }
  }
}
</script>
