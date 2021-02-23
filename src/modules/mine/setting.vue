<template>
  <!-- 个人中心 -->
  <div class="mine-index">
    <div class="info">
      <div class="avartor">
        <img :src="loginInfo.employeePhoto?loginInfo.employeePhoto:defaultImg" alt="">
        <!-- <p>{{ loginInfo.jobName }}</p> -->
      </div>
      <div class="detail">
        <span class="name" v-if="loginInfo.employeeName">{{ loginInfo.employeeName }}</span>
        <span class="name" v-else>{{ currentUser.displayName }}</span>
        <p v-if="loginInfo.jobName">{{ loginInfo.jobName }}</p>
        <p>
          <span v-if="loginInfo.joinDate">
            <i class="iconfont iconzuocedaohangtubiao-fangkeguanli-yuangongkaoqinjilu"></i>
            {{ $moment(loginInfo.joinDate).format('YYYY-MM-DD') }}
          </span>
          <span style="margin-left:24px;">
            <i v-if="days!==0" class="iconfont iconjichutubiao-dengdaizhong"></i>
            <span v-if="years!==0">{{years}}年</span>
            <span v-if="months!==0">{{months}}月</span>
            <span v-if="days!==0">{{days}}天</span>
          </span>
        </p>
      </div>
    </div>
    <div v-if="loginInfo.employeeId" class="content">
      <van-cell v-permission="'uban.carerui.team'" is-link :to="`/home/team?employeeId=${loginInfo.employeeId}&&employeeName=${loginInfo.employeeName}`" :value="loginInfo.num?loginInfo.num+'人':''">
        <template #title>
          <img src="../../assets/img/team.png">
          <span class="custom-title">我的团队</span>
        </template>
      </van-cell>
      <van-cell v-permission="'uban.carerui.performance'" value="开发中" is-link to="">
        <template #title>
          <img src="../../assets/img/jixiao.png">
          <span class="custom-title">团队绩效</span>
        </template>
      </van-cell>
      <van-cell value="开发中" is-link to="">
        <template #title>
          <img src="../../assets/img/butie.png">
          <span class="custom-title">我的补贴</span>
        </template>
      </van-cell>
    </div>
    <div class="bottom">
      <van-button v-if="insideWeixin && currentUser.loginCategory != 100" @click="bindingWechat" type="default" block>绑定微信</van-button>
      <van-button type="default" to="/home" block>返回首页</van-button>
      <van-button type="default" :to="{name:'PassportLogout'}" block>退出登录</van-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
import types from "@/store/types";
import settings from "@/settings";
import utils from "@/utils";

export default {
  name: "MineIndex",
  data() {
    return {
      loginInfo: {
        employeePhoto: "",
        employeeName: "",
        jobName: "",
        joinDate: ""
      },
      defaultImg: require("../../assets/img/avator.png"),
      displayName: "",
      logined: false,
      years: 0,
      months: 0,
      days: 0,
      currentUser: {
        loginCategory: null,
        loginName: null,
        displayName: null
      },
      insideWeixin: false,
      tenantId: null,
    };
  },
  computed: {
    ...mapGetters({
      getCurrentUser: types.GetCurrentUser
    })
  },
  components: {},
  created() {
    this.getTeamInfo();
    this.insideWeixin = utils.isWeixin();
    this.currentUser = this.getCurrentUser;
    this.tenantId = this.currentUser.customerId;
  },
  methods: {
    // 查询我的员工和子员工绑定信息
    getTeamInfo() {
      axios.fetch("oaServer", "/employee/carer").then(res => {
        if (res.data) {
          this.loginInfo = res.data;
          var nowDate = this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          let t1 = this.loginInfo.joinDate
            ? this.$moment(this.loginInfo.joinDate)
            : "";
          let t2 = this.$moment(nowDate);
          //计算时间差并转换成标准时间单位
          if (t2 && t1) {
            let dura = t2.format("x") - t1.format("x");
            let tempTime = this.$moment.duration(dura);
            this.years = tempTime.years();
            this.months = tempTime.months();
            this.days = tempTime.days();
          }
        }
      });
    },
    bindingWechat() {
      let redirect = window.location.href;
      window.location.href = settings.urls.wechat + "&_tenant=" + (this.tenantId ? this.tenantId : '') + "&action=binding&redirect=" + encodeURIComponent(redirect);
    }
  }
};
</script>

<style lang="less" scoped>
p {
  margin: 0;
}
.mine-index {
  // padding: 0 0.02rem;
  .info {
    box-sizing: border-box;
    padding-top: 0.25rem;
    height: 1.6rem;
    background-color: #00c844;
    display: flex;
    p {
      color: #ffffff;
    }
    .avartor {
      box-sizing: border-box;
      padding: 0 0.14rem 0.1rem 0.14rem;
      width: 1rem;
      height: 100%;
      text-align: center;
      img {
        border-radius: 50%;
        width: 0.6rem;
        height: 0.6rem;
      }
      p {
        font-size: 0.12rem;
        font-weight: 500;
      }
    }
    .detail {
      color: #fff;
      flex: 1;
      .name {
        font-size: 0.22rem;
        letter-spacing: 0.38px;
      }
      p {
        line-height: 0.36rem;
        font-size: 0.12rem;
        i {
          transform: scale(0.8);
        }
      }
    }
  }
  .content {
    margin-top: 0.12rem;
    /deep/ .van-cell {
      height: 0.58rem;
      padding: 0.1rem 0.16rem;
      position: relative;
      .van-cell__title {
        padding: 0.02rem 0;
        position: relative;
        img {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 0.24rem;
          height: 0.24rem;
        }
        .custom-title {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 0.36rem;
        }
      }
      .van-cell__value {
        line-height: 0.38rem;
      }
      .van-icon-arrow {
        // right: 0.16rem;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .bottom {
    margin-top: 0.36rem;
  }
}
</style>
