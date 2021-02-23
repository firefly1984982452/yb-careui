<template>
  <div class="content">
    <p class="p1">{{ tenantTitle }}</p>
    <p class="p2">让老人幸福·让家属放心</p>
    <div v-if="!logined">
      <van-tabs animated>
        <van-tab title="密码登录">
          <van-field v-model="loginName" center clearable :left-icon="require('@/assets/img/user.png')" label="" placeholder="请输入登录名">
          </van-field>
          <van-field v-model="password" type="password" center clearable :left-icon="require('@/assets/img/password.png')" label="" placeholder="请输入登录密码">
          </van-field>
          <van-button @click="login" class="button" type="default">密码登录</van-button>
        </van-tab>
        <van-tab title="短信登录">
          <van-field v-model="phoneNumber" type="digit" maxlength="11" center clearable left-icon="phone-o" label="" placeholder="请输入手机号码">
          </van-field>
          <van-field v-model="validationCode" type="digit" maxlength="6" center clearable left-icon="envelop-o" label="" placeholder="请输入验证码">
            <template #button>
              <van-button size="small" round type="primary" @click="sendValidation">{{ countDownTitle }}</van-button>
            </template>
          </van-field>
          <van-button @click="smsLogin" class="button" type="default">短信登录</van-button>
        </van-tab>
      </van-tabs>
      <van-button v-if="insideWeixin" @click="wechatLogin" :icon="require('@/assets/img/wechat.png')" class="button button-wechat" type="default">微信登录</van-button>
    </div>
    <div v-else>
      <p class="p2">你已作为 {{ displayName }} 登录了</p>
      <button class="button" @click="gotoDesktop">返回首页</button>
    </div>
    <div class="bottom-space"></div>
    <!-- 底部版权 -->
    <bottom />
  </div>
</template>

<script type="text/javascript">
import axios from 'axios'
import md5 from 'md5'
import { mapGetters } from 'vuex'
import types from '@/store/types'
import utils from '@/utils'
import settings from '@/settings'
import tenant from '@/components/_tenant'

const phoneChecker = /^1[3456789]\d{9}$/;

export default {
  computed: {
    ...mapGetters({
      getCurrentUser: types.GetCurrentUser
    })
  },
  data() {
    return {
      logined: false,
      displayName: null,
      loginName: '',
      password: '',
      insideWeixin: false,
      phoneNumber: '',
      validationCode: '',
      countDownNumber0: 0,
      countDownNumber: 0,
      countDownTitle: '获取验证码',
      tenantTitle: '有伴云',
      tenantId: null,
    };
  },
  created() {
    this.insideWeixin = utils.isWeixin();
    this.onlogin();
  },
  methods: {
    sendValidation() {
      if(this.countDownNumber < this.countDownNumber0) {
        this.$toast.fail("重发验证码还未到时间");
        return;
      }
      if(!this.phoneNumber) {
        this.$toast.fail("请输入手机号码");
        return;
      }
      if(!phoneChecker.test(this.phoneNumber)){ 
        this.$toast.fail("手机号码有误，请重新输入");
        return;
      }
      axios.fetch("userServer", "/user/sms/validationCode", { appNo: 'console', phoneNumber: this.phoneNumber, tenantId: this.tenantId }).then(res => {
        this.$toast.success("发送成功");
        this.countDownNumber0 = res.data;
        this.countDownNumber = this.countDownNumber0 - 1;
        this.countDown();
      });
    },
    countDown() {
      setTimeout(() => {
        this.countDownTitle = '' + this.countDownNumber-- + ' 秒后重发';
        if(this.countDownNumber > 0) {
          this.countDown();
        } else {
          this.countDownNumber = 0;
          this.countDownNumber0 = 0;
          this.countDownTitle = '重发验证码';
        }
      }, 1000);
    },
    smsLogin() {
      if(!this.phoneNumber) {
        this.$toast.fail("请输入手机号");
        return;
      }
      if(!phoneChecker.test(this.phoneNumber)){ 
        this.$toast.fail("手机号码有误，请重新输入");
        return;
      }
      if(!this.validationCode) {
        this.$toast.fail("请输入短信验证码");
        return;
      }
      axios.fetch("userServer", "/user/login/validationCode", { appNo: 'console', phoneNumber: this.phoneNumber, validationCode: this.validationCode, tenantId: this.tenantId }).then(res => {
        this.$toast.success('登录成功');
        this.loginSuccess(res.data);
      });
    },
    async loginSuccess(user) {
      await axios.fetchCurrentUser();
      this.onlogin(user);
      //this.gotoDesktop();
      let redirect = this.$route.query.redirect;
      if (redirect) {
        window.location.replace(redirect);
      } else {
        this.gotoDesktop();
      }
    },
    onlogin(user) {
      if(!user) {
        user = this.getCurrentUser;
      }
      if(user && user.userId > 0) {
        this.logined = true;
        this.displayName = user.displayName;
      } else {
        this.logined = false;
        this.displayName = null;
      }
      this.fetchTenant();
    },
    login() {
      if(!this.loginName) {
        this.$toast.fail("请输入登录名");
        return;
      }
      if(!this.password) {
        this.$toast.fail("请输入密码");
        return;
      }
      // 密码处理
      let password = this.password;
      let ticket = utils.dateFormat(new Date(), "yyyyMMddhhmmss");
      password = md5(password) + ticket;
      password = md5(password) + ticket;
      let that = this;
      axios.fetch("userServer", "/user/login", { appNo: 'carer', loginName: this.loginName, password, tenantId: this.tenantId }).then(res => {
        if (res.code == 200) {
          that.$toast.success("登录成功");
          that.password = null;
          that.loginSuccess(res.data);
        }
      })
    },
    gotoDesktop() {
      this.$router.replace('/home').catch(e => { });
    },
    wechatLogin() {
      var redirect = this.$route.query.redirect;
      if(!redirect) {
        redirect = window.location.href;
      }
      window.location.href = settings.urls.wechat + "&_tenant=" + (this.tenantId ? this.tenantId : '') + "&action=login&redirect=" + encodeURIComponent(redirect);
    },
    fetchTenant() {
      tenant.fetchCurrentTenant().then(data => {
        if(data) {
          this.tenantTitle = data.tenantName;
          this.tenantId = data.tenantId;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding-top: 0.2rem;
  text-align: center;
  p {
    text-align: center;
    font-family: PingFangSC-Light;
  }
  .p1 {
    font-size: 0.28rem;
    color: #00c744;
    font-weight: 700;
  }
  .p2 {
    margin-top: 0.12rem;
    margin-bottom: 0.5rem;
    font-size: 0.16rem;
    color: rgba(0, 0, 0, 0.4);
  }
  /deep/ .van-tabs__nav {
    background-color: transparent;
  }
   /deep/ .van-tabs__line {
    background-color: #00c744;
  }
  /deep/ .van-hairline--top-bottom::after {
    border-width: 0px;
  }
  /deep/ .van-tab__text {
    font-size: 0.16rem;
  }
  /deep/ .van-field__left-icon i {
    font-size: 0.18rem;
  }
  .van-cell {
    width: 90%;
    left: 5%;
    font-size: 0.15rem;
    margin-top: 0.15rem;
    background-color: transparent;
    &::after {
      right: 16px;
      border-bottom: 1px solid #dddddd;
    }
    /deep/ .van-icon__image {
      width: 0.16rem;
      height: 0.16rem;
    }
    /deep/ .van-field__value {
      padding-left: 10px;
    }
  }
  .bottom-space {
    height: 0.5rem;
  }
  .button {
    margin-top: 0.2rem;
    width: 80%;
    //bottom: -0.8rem;
    height: 0.37rem;
    //position: absolute;
    //left: 50%;
    //transform: translateX(-50%);
    background: #00c744;
    border-radius: 0.16rem;
    font-size: 0.16rem;
    font-weight: 500;
    color: #fff;
    border: 1px solid rgba(213, 213, 213, 1);
  }
  .button-wechat {
    margin-top: 0.1rem;
    color: inherit;
    background: transparent;
  }
}
</style>
