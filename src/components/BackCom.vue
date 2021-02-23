<template>
  <div :class="{ 'back_com':true,'bgc_1':bgc === 1,'shadow':bgc === 0 }">
    <div class="icon" @click="goBack">
      <van-icon name="arrow-left" />
      <span>{{ backWording }}</span>
      <slot></slot>
    </div>
    <div v-if="showTitle" class="title">
      {{ title }}
    </div>
    <!-- <div v-else class="title"></div> -->
    <div class="back_menu" @click.stop="showMenu">
      <!-- <van-icon name="weapp-nav" /> -->
      <van-icon name="wap-nav" />
    </div>
    <van-popup height="30%" v-model="show" round position="bottom">
      <ub-menu-ctrl></ub-menu-ctrl>
      <van-button block @click="logout">退出登录</van-button>
    </van-popup>
  </div>
</template>

<script type="text/javascript">
import ubMenuCtrl from "./menuctrl";
export default {
  name: "BackCom",
  props: {
    path: {
      type: String,
      default: "",
    },
    bgc: {
      type: Number,
      default: 0,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    backWording: {
      type: String,
      default: "返回",
    },
  },
  data() {
    return {
      title: "",
      show: false,
    };
  },
  created() {
    this.title = this.$route.name;
  },
  components: { ubMenuCtrl },
  methods: {
    goBack() {
      if (!this.path) {
        this.$router.go(-1);
      } else {
        this.$router.replace({
          path: this.path,
        });
      }
    },
    showMenu() {
      this.show = this.show ? false : true;
    },
    // 登出
    logout() {
      this.$router.push({ name: "PassportLogout" });
    },
  },
};
</script>

<style lang="less" scoped>
@height: 0.56rem;
.back_com {
  width: 100%;
  height: @height;
  display: flex;
  background-color: #fff;
  align-items: center;
  font-weight: 600;
  position: relative;
  .icon,
  .back_menu {
    height: @height;
    // width: 0.72rem;
    // line-height: @height;
    font-size: 0.2rem;
    position: absolute;
  }
  .icon {
    // padding-left: 0.12rem;
    left:0.12rem;
    // line-height: 0.56rem;
    display: flex;
    align-items: center;
    font-size: 0.16rem;
    .van-icon {
      font-size: 0.2rem;
      // line-height: 0.57rem;
    }
    >span {
      line-height: 0.20rem;
    }
  }
  .back_menu {
    // text-align: right;
    // padding-right: 0.12rem;
    right: 0.12rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .title {
    height: @height;
    flex: 1;
    // line-height: @height;
    text-align: center;
    font-size: 0.16rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/ .van-grid {
    background-color: #f8f8f8;
    .van-grid-item {
      margin: 14px 0;
    }
    .van-grid-item__content {
      background-color: #f8f8f8;
      padding: 0;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
  /deep/ .van-popup {
    padding-top: 0.12rem;
    > p {
      font-size: 0.12rem;
      color: rgba(0, 0, 0, 0.25);
      line-height: 0.32rem;
      text-align: center;
      margin: 0 0 0.12rem 0;
    }
    background-color: #f8f8f8;
  }
  /deep/ .van-button {
    margin-top: 0.12rem;
    height: @height;
    // color: red;
  }
}
// 护工端导航栏背景主题色
.back_com.bgc_1 {
  background-color: #69ca8d;
  color: #ffff;
}
.back_com.shadow {
  box-shadow: inset 0px 0px 2px 0px #ccc;
}
</style>
