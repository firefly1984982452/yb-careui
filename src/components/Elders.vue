<template>
  <div class="elders">
    <van-index-bar :index-list="indexList">
      <div class="room" :id="data.roomName" v-for="(data,index) in datas">
        <van-index-anchor :index="data.roomName" />
        <!-- <p>{{data.roomName}}</p> -->
        <ul class="elders_detail">
          <li @click="jump(elder)" v-for="(elder,i) in data.elderInfoVoList">
            <span class="avart">
              <i v-if="elder.isNew">新</i>
              <img :src="elder.elderPhoto?elder.elderPhoto:require('@/assets/img/icon-bed-default.png')" alt="">
            </span>
            <div>
              <p>{{elder.elderName}}</p>
              <p style="margin:0;font-size:12px;color:rgba(0,0,0,.4)">护理{{elder.nursingLevel | filterLevel}}级&nbsp;&nbsp;{{elder.bedName}}号床</p>
            </div>
          </li>
        </ul>
      </div>
    </van-index-bar>
    <!-- <bottom></bottom> -->
    <van-dialog v-model="dialogShow" @confirm="handleConfirm" class="error_dialog" title="选择时间段" :show-confirm-button="false" show-cancel-button cancelButtonText="取消">
      <van-cell is-link v-for="(task,index) in tasks" @click="hanldeJump(task)" :key="index" :value="`${$moment(task.scheduleStart).format('HH:mm')}-${$moment(task.scheduleEnd).format('HH:mm')}`">
        <template #title>
          <div class="custom-title">{{task.areaName}}</div>
          <div>{{task.timeName}}</div>
        </template>
      </van-cell>
    </van-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Elders",
  props: {
    taskId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      dialogShow: false,
      tasks: [],
      value: "",
      current: {},
      indexList: [],
      datas: [],
    };
  },
  components: {},
  mounted() {
    this.getAlreadyElder();
  },
  filters: {
    filterLevel: (val) => {
      return ["", "一", "二", "三", "四", "五", "六"][val];
    },
  },
  methods: {
    onChange(index) {
      console.log(index);
    },
    handleFocus() {
      this.$router.push("search");
    },
    jump(data) {
      this.query = {};
      // console.log(this.$route);
      const path = this.$route.path;
      console.log(path);
      const query = {
        id: data.id,
        elderId: data.elderId,
        roomId: data.roomId,
        elderName: data.elderName,
        elderPhoto: data.elderPhoto,
        bedName: data.bedName,
        roomName: data.roomName,
        nursingLevel: data.nursingLevel,
        isNew: data.isNew,
      };
      this.query = query;
      switch (path) {
        // 给老人添加巡视记录(护理员)
        case "/orderly/elders":
          query.timeName = this.$route.query.timeName;
          this.$router.push({
            path: "check-register",
            query,
          });
          break;
        // 护理班长添加巡视记录
        case "/home/check-room":
          this.queryMainTask(query.roomId);
          // this.$router.push({
          //   path: "check-register",
          //   query,
          // });
          break;
        // 护理班长老人首页
        case "/home/elder-index":
          // this.getTurns(query);
          this.$router.push({
            path: "/orderly/projects",
            query,
          });
          break;
        // 护理员端老人首页
        case "/orderly/elder-index":
          this.$router.push({
            path: "projects",
            query,
          });
          break;
        default:
          break;
      }
    },
    hanldeJump(task) {
      this.query.taskId = task.id;
      this.query.timeName = `${this.$moment(task.scheduleStart).format(
        "HH:mm"
      )}-${this.$moment(task.scheduleEnd).format("HH:mm")}`;
      console.log(this.query);
      this.$router.push({
        path: "check-register",
        query: this.query,
      });
    },
    // 获取老人
    getAlreadyElder() {
      let api = "";
      const path = this.$route.path;
      if (path == "/orderly/elders") {
        api = "/carePatrolItem/get/elderInfoVo";
      } else {
        api = "/carePatrolItem/careLeader/get/elderInfoVo";
      }
      axios
        .fetch("careServer", api, {
          taskId: this.taskId ? this.taskId : null,
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            // const arr = [];
            // for (let index = 0; index < 10; index++) {
            //   arr.push(...res.data);
            // }
            res.data.forEach((item) => {
              this.indexList.push(item.roomName);
            });
            this.datas = res.data;
          }
        });
    },

    // get turns
    // getTurns(query) {
    //   axios.fetch("careServer", "/carePatrolItem/get/workTime").then((res) => {
    //     console.log(res);
    //     // this.turns = res.data ? res.data : [];
    //     // this.turn = this.turns[0].timeName;
    //     if (res.data && res.data.length > 0) {
    //       this.queryMainTask(
    //         this.$moment().format("YYYY-MM-DD"),
    //         res.data[0].startTime,
    //         res.data[0].endTime,
    //         query.roomId
    //       );
    //     }
    //   });
    // },
    // query main task
    queryMainTask(roomId) {
      axios
        .fetch("careServer", "/carePatrolTask/get/byNowTime", {
          roomId,
        })
        .then((res) => {
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
@deep: ~">>>";
@import "../assets/styles/common.less";
.elders {
  background-color: #f8f8f8;
  overflow: auto;
  p {
    margin: 0;
  }
  flex: 1;
  height: 100%;
  .room {
    // height: 8rem;
    background-color: #fff;
    > p {
      margin: 0;
      padding-left: 12px;
      line-height: 50px;
      font-size: 12px;
      color: #666666;
    }
    .elders_detail {
      // padding: 12px 0;
      // display: flex;
      // justify-content: space-between;
      border-bottom: 1px solid #eeeeee;
      li {
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
            // transform: translate(-50%, -50%);
            transform: translate(30%, -30%);
          }
        }
        // width: 30%;
        // height: 0.88rem;
        padding: 0.08rem 0.12rem;
        // text-align: center;
        position: relative;
        display: flex;
        align-items: center;
        i {
          position: absolute;
          right: 0;
          top: 0;
          display: inline-block;
          height: 17px;
          width: 17px;
          transform: translate(-50%, -50%);
          background-color: #0085dc;
          font-style: normal;
          font-size: 12px;
          color: #fff;
          border-radius: 50%;
        }
        img {
          width: 47px;
          height: 47px;
          border-radius: 50%;
        }
        > div {
          margin-left: 0.08rem;
        }
      }
    }
  }
  @{deep} .van-index-bar {
    padding-left: 0.94rem;
    height: 100%;
    position: relative;
    .van-index-bar__sidebar {
      background-color: #f8f8f8;
      height: 80%;
      overflow: auto;
      z-index: 1;
      position: fixed;
      // display: flex;
      //   justify-content: center;
      left: 0;
      top: 50%;
      float: left;
      width: 0.94rem;
      transform: translateY(-50%);
      .van-index-bar__index--active {
        background-color: #fff;
      }
      .van-index-bar__index--active::before {
        content: "";
        border: 2px solid #00c744;
        height: 0.2rem;
        position: absolute;
        left: 0;
        top: 0.15rem;
      }
      span {
        position: relative;
        height: 0.5rem;
        line-height: 0.5rem;
        padding: 0;
      }
    }
  }
  .van-cell {
    align-items: center;
  }
}
</style>
