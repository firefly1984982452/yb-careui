<template>
  <div class="turns">
    <!-- 打卡巡视 班次 -->
    <div class="card" v-for="(turn,index) in turns" :key="index">
      <van-tag type="primary">{{turn.areaName}}</van-tag>
      <p class="description">当前班次&nbsp;&nbsp;
        <span v-if="taskType==1">进行中</span>
        <span v-else>未开始</span>
      </p>
      <p class="period">
        <i class="iconfont iconzuocedaohangtubiao-fangkeguanli-yuangongkaoqinjilu"></i>
        {{ $moment(turn.scheduleStart).format('HH:mm') }}
        ~
        {{ $moment(turn.scheduleEnd).format('HH:mm') }}
      </p>
      <van-button type="info" @click="handleClick(turn)" block>开始查房</van-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { wxconfig } from "@/utils/wechat";
export default {
  name: "Turns",
  data() {
    return {
      turns: [],
      //任务类型0：主任务，1：子任务
      taskType: "",
    };
  },
  created() {
    this.getCurrentTurn();
  },
  methods: {
    // 获取班次
    getCurrentTurn() {
      axios.fetch("careServer", "/carePatrolTask/get/byTime").then((res) => {
        if (res.code == 200) {
          this.turns = res.data.carePatrolSubtaskTwoVo;
          //任务类型0：主任务，1：子任务
          this.taskType = res.data.taskType;
        }
      });
    },
    wechatInvoke() {
      // 调用微信JSSDK
      wxconfig(["scanQRCode"], false).ready(() => {
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          // success: function (res) {
          //   console.log(res.resultStr); // 当needResult 为 1 时，扫码返回的结果

          //   const path = `${res.resultStr}&taskId=${taskId}&areaId=${areaId}`;
          //   const arr = path.substr(path.indexOf("?") + 1).split("&");
          //   console.log(arr);
          //   let roomId = "";
          //   arr.forEach((item) => {
          //     let h = item.split("=");
          //     if (h[0] == "roomId") {
          //       roomId = h[1];
          //     }
          //   });
          //   console.log(roomId);
          //   this.getInfoByRoomId(roomId, taskId, areaId, path);
          //   // this.getInfoByRoomId(taskId, areaId, res.resultStr);
          // },
        });
        // wx.chooseImage({
        //   count: 1, // 默认9
        //   sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        //   sourceType: ["camera"], // 可以指定来源是相册还是相机，默认二者都有'album', 'camera'
        //   success: function (res) {
        //     let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        //     that.$toast.success(localIds[0]);
        //   },
        // });
      });
    },
    handleClick(turn) {
      // console.log(turn);
      console.log(this.taskType);
      if (this.taskType == 1) {
        this.wechatInvoke();
      } else {
        this.addTask(turn.id, turn.areaId);
      }
    },
    // 根据房间ID查询护理查房巡视记录
    getInfoByRoomId(roomId, taskId, areaId, path) {
      axios
        .fetch("careServer", "/carePatrolItem/get/byRoomId", {
          roomId,
          taskId,
          areaId,
        })
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$router.push(path);
          }
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
          this.wechatInvoke();
        });
    },
  },
  filters: {
    // statusFilter: function (value) {
    //   if (value == 0) {
    //     return "未开始";
    //   } else if (value == 1) {
    //     return "已开始";
    //   } else if (value == 2) {
    //     return "已结束";
    //   } else {
    //     return "已交班";
    //   }
    // },
  },
};
</script>

<style lang="less" scoped>
.turns {
  background-color: #fff;
  // height: 100%;
  // text-align: center;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // padding-left: 10%;
  padding: 0.12rem 0 0.12rem 8%;
  p {
    margin: 0;
  }
  .card {
    margin-top: 0.12rem;
    height: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 84%;
    border: 1px solid #8ec2ff;
    border-radius: 0.08rem;
    position: relative;
    padding: 0.12rem;
    .description {
      font-size: 0.16rem;
      line-height: 0.32rem;
      font-weight: 600;
      span {
        font-size: 0.14rem;
        color: rgba(0, 0, 0, 0.4);
      }
    }
    .period {
      line-height: 0.26rem;
      height: 0.44rem;
      color: #3e8ef7;
      font-size: 0.16rem;
      font-weight: 700;
      // width: 80%;
      box-sizing: border-box;
      padding: 0.08rem 0.12rem;
      border: 1px solid #8ec2ff;
      border-radius: 0.2rem;
      i {
        color: #8ec2ff;
      }
    }
    .van-tag {
      position: absolute;
      top: 0;
      right: 0;
    }
    .van-button {
      width: 90%;
      font-size: 0.16rem;
      font-weight: 600;
    }
  }
}
</style>
