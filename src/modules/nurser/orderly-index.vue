<template>
  <div class="home_index">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
      </router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive">
      <router-view />
    </router-view>
    <div class="van-hairline--top-bottom van-tabbar van-tabbar--fixed">
      <div class="van-tabbar-item" v-for="(item, i) in tabs" :key="i" :class="{ cur: iscur == i }" @click="handleClick(item,i)">
        <div class="van-tabbar-item__icon">
          <img v-if="item.image" :src="iscur == i ? item.imageActive : item.image" alt="" srcset="">
          <i v-else-if="$route.path == '/orderly/check-records'" style="font-size:0.48rem;color:#fff;" class="iconfont icontubiao-jichutubiao-tianjia3x"></i>
          <i v-else style="font-size:0.48rem;color:#fff;" class="iconfont iconscanQR"></i>
        </div>
        <div v-if="item.text" class="van-tabbar-item__text">{{ item.text }}</div>
      </div>
    </div>

    <!-- <van-dialog v-model="dialogShow" @confirm="handleConfirm" class="error_dialog" title="选择班次" show-cancel-button cancelButtonText="取消" confirmButtonText="确认"> -->
    <van-dialog v-model="dialogShow" @confirm="handleConfirm" class="error_dialog" title="选择班次" :show-confirm-button="false" show-cancel-button cancelButtonText="取消">
      <van-cell is-link v-for="(task,index) in tasks" :to="`elders?taskId=${task.id}&timeName=${$moment(task.scheduleStart).format('HH:ss')}-${$moment(task.scheduleEnd).format('HH:ss')}`" :key="index" :value="`${$moment(task.scheduleStart).format('HH:ss')}-${$moment(task.scheduleEnd).format('HH:ss')}`">
        <template #title>
          <div class="custom-title">{{task.areaName}}</div>
          <div>{{task.timeName}}</div>
        </template>
      </van-cell>
    </van-dialog>
  </div>
</template>

<script type="text/javascript">
import { wxconfig,handleScanResult } from "@/utils/wechat";
export default {
  name: "HomeIndex",
  data() {
    return {
      iscur: 0,
      tabs: [
        {
          text: "首页",
          name: "page1",
          image: require("@/assets/img/icon-home-menu-01.png"),
          imageActive: require("@/assets/img/icon-home-menu-active-01.png"),
          path: "/orderly/index",
        },
        {
          text: "长者",
          name: "page2",
          image: require("@/assets/img/icon-home-menu-02.png"),
          imageActive: require("@/assets/img/icon-home-menu-active-02.png"),
          path: "/orderly/elder-index",
        },
        {
          text: "",
          name: "page2",
          image: "",
          imageActive: "",
          path: "turns",
        },
        {
          text: "点餐",
          name: "page3",
          image: require("@/assets/img/food.png"),
          imageActive: require("@/assets/img/foodActived.png"),
          path: "/orderly/food-sum",
        },
        {
          text: "我的",
          name: "page3",
          image: require("@/assets/img/icon-home-menu-03.png"),
          imageActive: require("@/assets/img/icon-home-menu-active-03.png"),
          path: "/orderly/mine-index",
        },
      ],
      tasks: [], // 所有主任务
      dialogShow: false,
    };
  },
  components: {},
  created() {
    console.log(this.$route);
    this.tabs.forEach((tab, index) => {
      if (tab.path == this.$route.path) {
        this.iscur = index;
        return;
      }
    });
  },
  watch: {
    $route(newValue, oldValue) {
      console.log(newValue);
      this.dialogShow = false;
      switch (newValue.path) {
        case "/orderly/index":
          this.iscur = 0;
          break;
        case "/orderly/elder-index":
          this.iscur = 1;
          console.log(this.iscur);
          break;
          case "/orderly/food-sum":
          this.iscur = 3;
          console.log(this.iscur);
          break;
        case "/orderly/mine-index":
          this.iscur = 4;
          break;
        default:
          this.iscur = null;
          break;
      }
    },
  },
  methods: {
    wechatInvoke() {
      var that = this;
      // let path = 'https://dahua.youbankeji.com/carerui/orderly/scan-result?roomId=34';
      // const roomId = handleScanResult(path);
      // console.log(roomId);
      // this.$router.push({
      //   path:'/orderly/scan-result',
      //   query:{
      //     roomId
      //   }
      // })
      // 调用微信JSSDK
      wxconfig(["scanQRCode"], false).ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success:(res)=> {
            let path = res.resultStr;
            console.log(path);
            const roomId = handleScanResult(path);
            that.$router.push({
              path:'/orderly/scan-result',
              query:{
                roomId
              }
            })
          }
        });
      });
    },
    tabChange() {},
    // 获取班次
    getCurrentTurn() {
      axios.fetch("careServer", "/carePatrolTask/get/byTime").then((res) => {
        if (res.code == 200) {
          this.$router.push("turns");
        }
      });
    },
    // 处理下部导航栏切换事件
    handleClick(item, i) {
      if (this.$route.fullPath !== item.path) {
        if (item.path) {
          if (i == 2) {
            if (this.$route.path == "/orderly/check-records") {
              // this.$router.push("elders");
              // this.dialogShow = true;
              // 巡视记录界面
              // 显示弹框 选择班次
              this.queryMainTask();
            } else {
              // 获取班次
              // this.getCurrentTurn();
              this.wechatInvoke();
            }
          } else {
            this.iscur = i;
            this.$router.push(item.path);
          }
        } else {
          this.$toast("开发中");
        }
      }
    },
    // get turns
    // getTurns() {
    //   axios.fetch("careServer", "/carePatrolItem/get/workTime").then((res) => {
    //     console.log(res);
    //     // this.turns = res.data ? res.data : [];
    //     // this.turn = this.turns[0].timeName;
    //     if (res.data && res.data.length > 0) {
    //       this.queryMainTask(
    //         this.$moment().format("YYYY-MM-DD"),
    //         res.data[0].startTime,
    //         res.data[0].endTime
    //       );
    //     }
    //   });
    // },
    // query main task
    queryMainTask() {
      axios.fetch("careServer", "/carePatrolTask/get/byNowTime").then((res) => {
        if (res.data && res.data.length > 0) {
          this.dialogShow = true;
          this.tasks = res.data;
        } else {
          this.$toast("没有可以选择的时间段");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@navHeight: 0.6rem;
.home_index {
  height: calc(100% - @navHeight);
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
 /deep/ .error_dialog.van-dialog {
    display: flex;
    max-height: 3rem;
    flex-direction: column;
    .van-dialog__header {
      height: .46rem;
    }
    .van-dialog__content {
      overflow: auto;
      flex: 1;
    }
    .van-dialog__footer {
      overflow: unset!important;
      height: 0.46rem;
    }
}
</style>
