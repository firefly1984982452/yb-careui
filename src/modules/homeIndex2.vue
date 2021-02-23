<template>
  <div class="home_index">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"> </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
      <router-view />
    </router-view>
    <div
      class="van-hairline--top-bottom van-tabbar van-tabbar--fixed"
      v-if="show"
    >
      <div
        class="van-tabbar-item"
        v-for="(item, i) in tabs"
        :key="i"
        :class="{ cur: iscur == i }"
        @click="handleClick(item, i)"
      >
        <div class="van-tabbar-item__icon">
          <img
            v-if="item.image"
            :src="iscur == i ? item.imageActive : item.image"
            alt=""
            srcset=""
          />
          <i
            v-else-if="$route.path == '/orderly/check-records'"
            style="font-size:0.48rem;color:#fff;"
            class="iconfont icontubiao-jichutubiao-tianjia3x"
          ></i>
          <i
            v-else
            style="font-size:0.48rem;color:#fff;"
            class="iconfont iconscanQR"
          ></i>
        </div>
        <div v-if="item.text" class="van-tabbar-item__text">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { wxconfig } from "@/utils/wechat";

let that;
export default {
  name: "rules",
  filters: {},
  data() {
    return {
      show: false,
      iscur: 0,
      tabs: [
        {
          text: "首页",
          name: "page1",
          image: require("../assets/img/icon-home-menu-01.png"),
          imageActive: require("../assets/img/icon-home-menu-active-01.png"),
          path: "/home/home"
        },
        {
          text: "长者",
          name: "page2",
          image: require("../assets/img/icon-home-menu-02.png"),
          imageActive: require("../assets/img/icon-home-menu-active-02.png"),
          path: "/home/elder-index"
        },
        {
          text: "",
          name: "page2",
          image: "",
          imageActive: "",
          path: "turns"
        },
        {
          text: "点餐",
          name: "page3",
          image: require("../assets/img/food.png"),
          imageActive: require("../assets/img/foodActived.png"),
          path: "/home/food-sum"
        },
        {
          text: "我的",
          name: "page3",
          image: require("../assets/img/icon-home-menu-03.png"),
          imageActive: require("../assets/img/icon-home-menu-active-03.png"),
          path: "/home/setting"
        }
      ]
    };
  },
  watch: {
    $route(newValue, oldValue) {
      console.log(newValue);
      if (
        newValue.name == "智慧护理工作台" ||
        newValue.name == "住养服务" ||
        newValue.name == "菜单列表" ||
        newValue.name == "订餐汇总"
      ) {
        this.$nextTick(() => {
          this.show = true;
        });
      } else {
        this.$nextTick(() => {
          this.show = false;
        });
      }
      console.log(this.show);
      switch (newValue.path) {
        case "/home/home":
          this.iscur = 0;
          break;
        case "/home/elder-index":
          this.iscur = 1;
          console.log(this.iscur);
          break;
        case "/home/food-sum":
          this.iscur = 3;
          console.log(this.iscur);
          break;
        case "/home/setting":
          this.iscur = 4;
          break;
        default:
          this.iscur = null;
          break;
      }
    }
  },
  beforeCreate() {
    that = this;
  },
  beforeRouteEnter(to, from, next) {
    if (
      to.name == "智慧护理工作台" ||
      to.name == "住养服务" ||
      to.name == "菜单列表" ||
      to.name == "订餐汇总"
    ) {
      next(vm => {
        vm.show = true;
      });
    } else {
      next(vm => {
        vm.show = false;
      });
    }
  },
  created() {
    console.log(this.$route);
    this.tabs.forEach((tab, index) => {
      if (tab.path == this.$route.path) {
        this.iscur = index;
        return;
      }
    });
  },
  methods: {
    handleClick(item, i) {
      if (this.$route.fullPath !== item.path) {
        if (item.path) {
          if (i == 2) {
            this.wechatInvoke();
          } else {
            this.iscur = i;
            this.$router.push(item.path);
          }
        } else {
          this.$toast("开发中");
        }
      }
    },
    wechatInvoke() {
      // 调用微信JSSDK
      wxconfig(["scanQRCode"], false).ready(() => {
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"] // 可以指定扫二维码还是一维码，默认二者都有
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
@navHeight: 0.6rem;
.home_index {
  // height: calc(100% - @navHeight);
  height: 100%;
  .van-tabbar {
    height: 0.5rem;
    .van-tabbar-item:nth-child(3) {
      flex: auto 0;
      z-index: 2;
      position: relative;
      top: calc(0.5rem - @navHeight);
      height: @navHeight;
      width: @navHeight!important;
      background-color: #69ca8d;
      // height: @navHeight;
      border-radius: 50%;
    }
  }
}
.cur {
  color: #69ca8d;
}
</style>
