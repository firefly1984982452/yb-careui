<template>
  <div class="scan_result">
    <Back :bgc="1" :path="'/orderly/index'"></Back>
    <!-- 扫码结果 -->
    <div class="header">
      <div class="title">
        <van-image width="24" height="32" :src="require('@/assets/img/icon-from-white@2x.png')" />
        <div>{{roomInfo.roomName}}</div>
      </div>
    </div>
    <div class="main">
      <div class="top" @click="goToCheckRoom">
        <div class="left">
          <div>
            <van-image width="64" height="64" :src="require('@/assets/img/chafang.png')" />
          </div>
          <div>
            <p>查房巡视</p>
            <p v-if="taskType===''||taskType===null||taskType===undefined">暂无任务</p>
            <p v-else>
              {{ $moment(currentTask.scheduleStart).format('HH:mm') }}
              ~
              {{ $moment(currentTask.scheduleEnd).format('HH:mm') }}</p>
          </div>
        </div>
        <div :class="{'right':true,'start':taskType===0}">
          <span v-if="taskType===0">开始</span>
          <!-- <span v-else>{{currentTask.perProportion}}</span> -->
          <van-circle v-else-if="taskType===1" v-model="percent" :rate="percent" :clockwise="false" :stroke-width="120" :speed="100" color="#69ca8d" layer-color="#ebedf0" :text="`${percent}%`" />
        </div>
      </div>
      <div class="bottom">
        <div class="left" @click="goToElderCare">
          <div>
            <van-image width="64" height="64" :src="require('@/assets/img/zhaohu.png')" />
            <!-- <i>9</i> -->
          </div>
          <p>
            长者照护
          </p>
        </div>
        <div class="right" @click="goToRoomTask">
          <div>
            <van-image width="64" height="64" :src="require('@/assets/img/dasao.png')" />
            <!-- <i>9</i> -->
          </div>
          <p>
            房间清理
          </p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <span @click="wechatInvoke">
        <i class="iconfont iconscanQR"></i>
        继续扫码
      </span>
    </div>
  </div>
</template>

<script type="text/javascript">
import { wxconfig,handleScanResult } from "@/utils/wechat";
import remConfig from "@/config/rem-config"; // 配置rem
remConfig();
export default {
  name: "ScanResult",
  data() {
    return {
      roomId: "",
      taskType: "",
      roomInfo: {},
      currentTask: {},
      routerQuery: {}, //路由携带的参数
      percent: "",
    };
  },
  components: {},
  created() {
    // this.roomId = this.$route.params.id
    //   ? Number(this.$route.params.id)
    //   : 0;
    this.roomId = this.$route.query.roomId
      ? Number(this.$route.query.roomId)
      : 0;
      console.log(this.roomId);
    if (this.roomId) {
      this.getRoomIfo(this.roomId);
    } else {
      this.$toast("此房间不存在");
      this.$router.push("/orderly/index");
    }
  },
  watch: {
    roomId(newValue, oldValue) {
      console.log(newValue);
      if (newValue) {
        this.getRoomIfo(newValue);
      } else {
        this.$toast("此房间不存在");
        this.$router.push("/orderly/index");
      }
    }
  },
  methods: {
    wechatInvoke() {
      var that = this;
      // let path = 'https://dahua.youbankeji.com/carerui/orderly/scan-result?roomId=31';
      // const roomId = handleScanResult(path);
      // console.log(roomId);
      // this.$router.push({
      //   // path:'/orderly/scan-result/' + roomId,
      //   path:'/orderly/scan-result',
      //   query:{
      //     roomId
      //   }
      // })
      // this.roomId = roomId;
      // 调用微信JSSDK
      wxconfig(["scanQRCode"], false).ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: (res) => {
            // console.log(res.resultStr);
            let path = res.resultStr;
            const roomId = handleScanResult(path);
            console.log(roomId);
            that.$router.push({
              path:'/orderly/scan-result',
              query:{
                roomId
              }
            })
            this.roomId = roomId;
          }
        });
      });
    },
    // 获取房间名称
    getRoomIfo(roomId) {
      axios
        .fetch("careServer", "/carePatrolItem/get/roomName", {
          roomId,
        })
        .then((res) => {
          this.roomInfo = res.data ? res.data : {};
          this.getCurrentTak(this.roomId);
        });
    },
    // 获取当前时间的任务
    getCurrentTak(roomId) {
      axios
        .fetch(
          "careServer",
          "/carePatrolTask/get/byTime",
          {
            roomId,
          },
          "form",
          "POST",
          false,
          {
            400: (data) => {
              this.$toast(data.message);
              this.$router.push("/orderly/index");
              // this.routerQuery = {
              //   roomId: this.roomInfo.roomId,
              //   roomName: this.roomInfo.roomName,
              //   areaId: this.roomInfo.areaId,
              // };
            },
          }
        )
        .then((res) => {
          if (
            res.data &&
            res.data.carePatrolSubtaskTwoVo &&
            res.data.carePatrolSubtaskTwoVo.length > 0
          ) {
            this.taskType = res.data.taskType;
            console.log(this.taskType);
            this.currentTask = res.data.carePatrolSubtaskTwoVo[0];
            this.percent = this.currentTask.perProportion * 100;
            this.routerQuery = {
              roomId: this.roomInfo.roomId,
              roomName: this.roomInfo.roomName,
              taskType: this.taskType,
              sign: this.percent == 100 ? "finished" : "",
              taskId: this.currentTask.id,
              areaId: this.roomInfo.areaId,
            };
          } else {
            this.routerQuery = {
              roomId: this.roomInfo.roomId,
              roomName: this.roomInfo.roomName,
              areaId: this.roomInfo.areaId,
            };
          }
        });
    },
    // 跳转到查房巡视界面
    goToCheckRoom() {
      this.routerQuery.timeName = `${this.$moment(
        this.currentTask.scheduleStart
      ).format("HH:mm")}-${this.$moment(this.currentTask.scheduleEnd).format(
        "HH:mm"
      )}`;
      if (this.taskType === 1) {
        this.$router.push({
          path: "check-room",
          query: this.routerQuery,
        });
      } else if (this.taskType === 0) {
        this.addTask(this.currentTask.id, this.roomInfo.areaId);
      } else {
        console.log("无任务");
      }
    },
    //
    goToRoomTask() {
      this.$router.push({
        path: "task",
        query: this.routerQuery,
      });
    },
    goToElderCare() {
      this.$router.push({
        path: "today-care",
        query: this.routerQuery,
      });
    },
    // 新增护理查房子任务信息
    addTask(taskId, areaId) {
      axios
        .fetch("careServer", "/carePatrolSubtask/add", {
          taskId,
          areaId,
        })
        .then((res) => {
          this.$router.push({
            path: "check-room",
            query: this.routerQuery,
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.scan_result {
  height: 100%;
  font-size: 14px;
  p {
    margin: 0;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  .header {
    width: 100%;
    height: 1rem;
    background-color: #69ca8d;
    color: #fff;
    // padding: 0.23rem 0 0 0;
    box-sizing: border-box;
    .title {
      padding: 0.08rem 0.12rem;
      display: flex;
      flex-direction: row;
      .van-image {
        margin-right: 0.12rem;
      }
      div {
        font-size: 0.24rem;
      }
    }
  }
  .main {
    width: 95%;
    flex: 1;
    margin-top: -0.4rem;
    // width: 3.6rem !important;
    .top {
      box-sizing: border-box;
      height: 1.18rem;
      border-radius: 0.08rem;
      background-color: #fff;
      padding: 0.24rem;
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        > div:nth-child(2) {
          margin-left: 0.12rem;
          p {
            line-height: 0.24rem;
          }
          p:nth-child(1) {
            font-size: 0.16rem;
            color: rgba(0, 0, 0, 0.85);
          }
          p:nth-child(2) {
            font-size: 0.15rem;
            color: #999999;
          }
        }
      }
      .right {
        width: 0.72rem;
        height: 100%;
        justify-content: center;
        display: flex;
        align-items: center;
        // background-color: pink;
      }
      .right.start {
        // background-color: pink;
        box-sizing: border-box;
        border-radius: 50%;
        border: 8px solid #eeee;
      }
    }
    .bottom {
      margin-top: 0.12rem;
      height: 1.64rem;
      display: flex;
      justify-content: space-between;
      background-color: #f8f8f8;
      > div {
        width: 48%;
        border-radius: 0.08rem;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        > div {
          position: relative;
          i {
            position: absolute;
            right: 0;
            top: 0;
          }
        }
        p {
          line-height: 0.44rem;
          font-size: 0.16rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 0.5rem;
    background-color: #fff;
    span {
      height: 100%;
      line-height: 0.5rem;
      float: right;
      width: 1.5rem;
      color: #fff;
      font-size: 0.18rem;
      background-color: #69ca8d;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 0.28rem;
      }
    }
  }
}
</style>
