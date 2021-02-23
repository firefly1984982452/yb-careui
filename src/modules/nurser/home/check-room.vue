<template>
  <div class="scan_result">
    <Back :bgc="1" :path="`/orderly/scan-result?roomId=${roomId}`"></Back>
    <!-- 扫码结果 -->
    <div class="header">
      <div class="title">
        <img src="../../../assets/img/icon-from-white@2x.png" alt="" srcset="" />
        <div>{{ roomName }}</div>
      </div>
      <div class="fr">
        <span>
          <van-image width="32" height="32" @click="goToElderCare" round :src="require('@/assets/img/icon-zhangzhezhaohu-white@2x.png')" />
        </span>
        <span>
          <van-image width="32" height="32" @click="toRoomTask" round :src="require('@/assets/img/icon-fangjianqingli-white@2x.png')" />
        </span>
      </div>
    </div>
    <div class="content">
      <van-cell :value="
          item.status == 0 ? '未巡视' : item.status == 1 ? '无异常' : '已记录'
        " :class="{ recorded: item.status == 3 }" is-link @click="handleClick(item)" v-for="(item, index) in carePatrolItemVoList" :key="index">
        <!-- 使用 title 插槽来自定义标题 -->
        <!-- https://image.youbankeji.com/20191127/201911271574828802604.jpg -->
        <template #title>
          <!-- <van-tag type="danger">标签</van-tag> -->
          <span class="avart">
            <van-image width="0.48rem" round height="0.48rem" fit="fill" :src="
                item.elderPhoto
                  ? item.elderPhoto
                  : require('@/assets/img/icon-bed-default.png')
              " />
            <i v-if="item.isNew">新</i>
          </span>
          <span class="custom-title">
            <p>{{ item.elderName }}</p>
            <p>
              护理{{ item.nursingLevel | filterLevel }}级&nbsp;&nbsp;{{
                item.roomName
              }}-{{ item.bedName }}
            </p>
            <p v-if="item.tags">
              <van-tag type="success" v-for="(tag, i) in item.tags.split(',')" :key="i">{{ tag }}</van-tag>
            </p>
          </span>
        </template>
      </van-cell>
    </div>
    <div class="bottom">
      <!-- {{remainPersonCoun}} -->
      <span v-if="remainPersonCoun" @click="handleContinue">
        <i class="iconfont iconscanQR"></i>
        继续查房
      </span>
      <span v-else-if="!$route.query.sign" @click="handleOver">
        <!-- <i class="iconfont iconscanQR"></i> -->
        结束查房
      </span>
      <span v-else @click="goBack">
        <!-- <i class="iconfont iconscanQR"></i> -->
        返回
      </span>
    </div>
  </div>
</template>

<script type="text/javascript">
import { wxconfig,handleScanResult } from "@/utils/wechat";
export default {
  name: "ScanResult",
  data() {
    return {
      bedName: "2",
      roomName: "",
      roomId: "",
      // areaId: "",
      subtaskId: "",
      taskId: "",
      remainPersonCoun: 0, //剩余人数数量
      carePatrolItemVoList: [],
    };
  },
  created() {
    this.roomId = Number(this.$route.query.roomId);
    this.taskId = Number(this.$route.query.taskId);
    // this.areaId = Number(this.$route.query.areaId);
    this.getInfoByRoomId();
  },
  filters: {
    filterLevel: (val) => {
      return ["", "一", "二", "三", "四", "五", "六"][val];
    },
  },
  components: {},
  methods: {
    handleClick(data) {
      this.$router.push({
        path: "check-register",
        query: {
          id: data.id,
          timeName: this.$route.query.timeName,
          isNew: data.isNew,
        },
      });
    },
    // 处理结束查房
    handleOver() {
      // axios
      //   .fetch("careServer", "/carePatrolItem/end/checkRoom", {
      //     subtaskId: this.subtaskId,
      //     taskId: this.taskId,
      //   })
      //   .then((res) => {
      //     if (res.code == 200) {
      this.$router.push("success");
      //   }
      // });
    },
    // continue to check room
    handleContinue() {
      this.wechatInvoke();
    },
    // wetchat scan
    wechatInvoke() {
      var that = this;
      // let path = 'https://dahua.youbankeji.com/carerui/orderly/scan-result?roomId=35';
      // const roomId = handleScanResult(path);
      // console.log(roomId);
      // this.$router.push({
      //   // path:'/orderly/scan-result/' + roomId,
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
          success: (res) => {
            console.log(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
            let path = res.resultStr;
            const roomId = handleScanResult(path);
            console.log(roomId);
            that.$router.push({
              path:'/orderly/scan-result',
              query:{
                roomId
              }
            })
          },
        });
      });
    },
    // 根据房间ID查询护理查房巡视记录
    getInfoByRoomId() {
      axios
        .fetch(
          "careServer",
          "/carePatrolItem/get/byRoomId",
          {
            roomId: this.roomId,
            taskId: this.taskId,
            // areaId: this.areaId,
          },
          "form",
          "POST",
          false,
          {
            400: (data) => {
              this.$toast(data.message);
              this.$router.push("index");
            },
          }
        )
        .then((res) => {
          // console.log(res);
          if (res.data) {
            this.taskId = res.data.taskId;
            this.roomName = res.data.roomName;
            this.remainPersonCoun = res.data.remainPersonCoun;
            this.subtaskId = res.data.subtaskId;
            this.carePatrolItemVoList = res.data.carePatrolItemVoList;
            // console.log(this.carePatrolItemVoList);
          }
        });
    },
    //
    goToElderCare() {
      this.$router.push({
        path: "today-care",
        query: this.$route.query,
      });
    },
    //
    toRoomTask() {
      this.$router.push({
        path: "task",
        query: this.$route.query,
      });
    },
    // 返回
    goBack() {
      this.$router.push({
        path: "scan-result",
        query: {
          roomId: this.roomId,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
p {
  margin: 0;
}
.scan_result {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .header {
    width: 100%;
    height: 1.38rem;
    background-color: #69ca8d;
    color: #fff;
    padding: 0.23rem 0 0 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-self: center;
    .title {
      display: flex;
      flex-direction: row;
      img {
        width: 0.24rem;
        height: 0.3rem;
        margin: 0 0.08rem 0 0.12rem;
      }

      div {
        font-size: 0.24rem;
      }
    }
    .fr {
      margin-right: 0.12rem;
      span + span {
        margin-left: 0.08rem;
      }
    }
  }
  .content {
    box-sizing: border-box;
    width: 100%;
    padding: 0 0.12rem;
    overflow: auto;
    margin-top: -0.6rem;
    flex: 1;
    flex-direction: column;
    @{deep} .van-cell {
      box-shadow: 0.01rem 0.05rem 0.06rem #eeee;
      border-radius: 0.08rem;
      align-items: center;
      min-height: 0.88rem;
      // height: 0.66rem;
      .van-cell__title {
        display: flex;
        flex: 1;
        align-items: center;
        .van-image {
          margin-right: 0.08rem;
        }
        p:nth-child(1) {
          font-weight: 600;
        }
        p:nth-child(2) {
          color: rgba(0, 0, 0, 0.4);
        }
      }
      .van-cell__value {
        width: 0.8rem;
        flex: none;
      }
      .van-icon {
        width: 0.16rem;
      }
      .van-tag {
        margin-right: 0.04rem;
      }
    }
    .recorded {
      .van-cell__value {
        color: #69ca8d !important;
      }
    }
    .avart {
      position: relative;
      i {
        border-radius: 50%;
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        background-color: #69ca8d;
        // display: inline-block;
        width: 0.18rem;
        height: 0.18rem;
        line-height: 0.18rem;
        font-style: normal;
        color: #fff;
        transform: translate(-50%, -50%);
      }
    }
    .van-cell + .van-cell {
      margin-top: 0.12rem;
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
