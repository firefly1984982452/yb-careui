<template>
  <div class="main" id="main">
    <!-- 菜单 -->
    <div class="nav" id="nav">
      <a href="javascript:" :class="{'active':index==0}" v-for="(item,index) in indexList" @click="goAnchor(item.roomId,index)" :key="index">{{item.roomName}}</a>
    </div>

    <!-- 内容 -->
    <div class="items" id="items">
      <div class="item" v-for="(data,index) in datas" :key="index">
        <!-- <div class="title" :id="data.roomName">{{data.roomName}}</div> -->
        <div class="title" :id="data.roomId">{{data.roomName}}</div>
        <div class="room">
          <ul class="elders_detail">
            <!-- <li @click="$route.path=='/orderly/elder-index' || $route.path=='/home/elder-index'?showActionSheet(elder):jump(elder)" v-for="(elder,i) in data.elderInfoVoList" :key="i"> -->
            <li @click=" isShowActionSheet ?showActionSheet(elder):jump(elder)" v-for="(elder,i) in data.elderInfoVoList" :key="i">
              <!-- <li @click="showActionSheet(elder)" v-for="(elder,i) in data.elderInfoVoList" :key="i"> -->
              <span class="avart">
                <i v-if="elder.isNew">新</i>
                <img :src="elder.elderPhoto?`${elder.elderPhoto}!avatar`:require('@/assets/img/icon-bed-default.png')" alt="">
              </span>
              <div style="flex:1;">
                <p style="line-height:0.32rem">{{elder.elderName}}
                  <van-tag type="warning" v-if="elder.isOrderMeal===false&&showFoodOrderRemark">
                    未订
                  </van-tag>
                  <van-tag type="success" v-if="elder.isOrderMeal&&showFoodOrderRemark">
                    已订
                  </van-tag>
                </p>
                <p style="margin:0;font-size:12px;color:rgba(0,0,0,.4)">护理{{elder.nursingLevel | filterLevel}}级&nbsp;&nbsp;{{elder.bedName}}号床</p>
              </div>
              <!-- <van-button class="detail" @click.stop="checkFoodDetail(elder)" v-if="$route.path=='/orderly/elder-index'" round type="primary">点餐详情</van-button> -->
              <!-- <van-icon v-if="$route.path=='/orderly/elder-index' || $route.path=='/home/elder-index'" name="weapp-nav" /> -->
              <van-icon v-if="isShowActionSheet" name="weapp-nav" />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <van-dialog v-model="dialogShow" @confirm="handleConfirm" class="error_dialog" title="选择时间段" :show-confirm-button="false" show-cancel-button cancelButtonText="取消">
      <van-cell is-link v-for="(task,index) in tasks" @click="hanldeJump(task)" :key="index" :value="`${$moment(task.scheduleStart).format('HH:mm')}-${$moment(task.scheduleEnd).format('HH:mm')}`">
        <template #title>
          <div class="custom-title">{{task.areaName}}</div>
          <div>{{task.timeName}}</div>
        </template>
      </van-cell>
    </van-dialog>
    <van-action-sheet v-model="show" :actions="types" @select="handleSelect" cancel-text="取消" close-on-click-action @cancel="onCancel" />
  </div>

</template>

<script>
export default {
  props: {
    taskId: {
      type: Number,
      default: null,
    },
    roomName: {
      type: String,
      default: "",
    },
    roomId: {
      type: Number,
      default: null,
    },
    // 是否展示点餐与否的标记
    showFoodOrderRemark: {
      type: Boolean,
      default: false,
    },
    // 是否弹出actionsheet
    isShowActionSheet: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      dialogShow: false,
      tasks: [],
      indexList: [],
      datas: [],
      divHeight: "",
      show: false,
      types: [
        {
          name: "服务项目",
          path: "/orderly/projects",
        },
        {
          name: "点餐详情",
          path: "/orderly/food-ordered",
        },
        {
          name: "请假管理",
          path: "/orderly/leave",
        },
      ],
      query: {},
    };
  },
  created() {
    this.getAlreadyElder();
  },
  mounted() {
    const itemsObj = document.getElementById("items");
    const itemObjs = document.getElementsByClassName("item");
    this.divHeight = document.getElementById("main").offsetHeight; //容器高度
    itemsObj.addEventListener("scroll", () => {
      // console.log(itemsObj.getBoundingClientRect().top);
      // console.log(divHeight);
      itemObjs[itemObjs.length - 1].style.height = this.divHeight + "px";
      const arr = [];
      for (let index = 0; index < itemObjs.length; index++) {
        const element = itemObjs[index];
        const top =
          element.getBoundingClientRect().top -
          itemsObj.getBoundingClientRect().top -
          1;
        // const top = element.offsetTop;
        arr.push(top);
      }
      // console.log(arr);
      arr.forEach((h, i) => {
        // console.log(h);
        if (i < itemObjs.length - 1) {
          if (h <= 0 && arr[i + 1] > 0) {
            // console.log(document.getElementsByTagName("a")[i].style);
            document.getElementsByTagName("a")[i].scrollIntoView({
              behavior: "smooth", // 平滑过渡
              block: "start", // 上边框与视窗顶部平齐。默认值
            });
            document.getElementsByTagName("a")[i].style.color = "#00c744";
            document.getElementsByTagName("a")[i].className = "active";
            document.getElementsByTagName("a")[i].style.backgroundColor =
              "#fff";
          } else {
            document.getElementsByTagName("a")[i].className = "";
            document.getElementsByTagName("a")[i].style.color = "black";
            document.getElementsByTagName("a")[i].style.backgroundColor =
              "#f8f8f8";
          }
        } else {
          if (h <= 0) {
            document.getElementsByTagName("a")[i].scrollIntoView({
              behavior: "smooth", // 平滑过渡
              block: "start", // 上边框与视窗顶部平齐。默认值
            });
            document.getElementsByTagName("a")[i].style.color = "#00c744";
            document.getElementsByTagName("a")[i].className = "active";
            document.getElementsByTagName("a")[i].style.backgroundColor =
              "#fff";
          } else {
            document.getElementsByTagName("a")[i].className = "";
            document.getElementsByTagName("a")[i].style.color = "black";
            document.getElementsByTagName("a")[i].style.backgroundColor =
              "#f8f8f8";
          }
        }
      });
    });
  },
  beforeUpdate() {
    console.log(this.roomId);
    console.log(this.roomName);
    // if (this.roomName) {
    //   this.$nextTick(() => {
    //     this.goAnchor(this.roomName, this.indexList.indexOf(this.roomName));
    //   });
    // }
    if (this.roomId) {
      this.$nextTick(() => {
        this.indexList.forEach((item,index) => {
          if(this.roomId === item.roomId){
            this.goAnchor(this.roomId, index);
          }
        })
      });
    }
  },
  filters: {
    filterLevel: (val) => {
      return ["", "一", "二", "三", "四", "五", "六"][val];
    },
  },
  methods: {
    // 标签滚动
    goAnchor(selector, index) {
      // console.log(index);
      // console.log(selector);
      const itemObj = document.getElementById("items");
      const itemObjs = document.getElementsByClassName("item");
      const targetObj = document.getElementById(selector);
      this.divHeight = document.getElementById("main").offsetHeight; //容器高度
      itemObjs[itemObjs.length - 1].style.height = this.divHeight + "px";
      targetObj.scrollIntoView({
        // behavior: "smooth", // 平滑过渡
        block: "start", // 上边框与视窗顶部平齐。默认值
      });
    },
    // 获取老人
    getAlreadyElder() {
      let api = "";
      const path = this.$route.path;
      // console.log(path);
      let serverName = "careServer";
      switch (path) {
        case "/orderly/elders":
          api = "/carePatrolItem/get/elderInfoVo";
          break;
        case "/home/food":
        case "/orderly/elder-index":
          serverName = "dietServer";
          api = "/dietPeriod/get/elderInfoVo";
          break;
        default:
          api = "/carePatrolItem/careLeader/get/elderInfoVo";
          break;
      }
      axios
        .fetch(serverName, api, {
          taskId: this.taskId ? this.taskId : null,
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            // const arr = [];
            // for (let index = 0; index < 10; index++) {
            //   arr.push(...res.data);
            // }
            res.data.forEach((item) => {
              // this.indexList.push(item.roomName);
              this.indexList.push(item);
            });
            this.datas = res.data;
            console.log(this.indexList);
          }
        });
    },
    jump(data) {
      this.query = {};
      // console.log(this.$route);
      const path = this.$route.path;
      // console.log(path);
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
        // 护理班长点餐
        case "/home/food":
          query.dietAvoid = data.dietAvoid ? data.dietAvoid : "正常";
          query.isOrderMeal = data.isOrderMeal;
          this.$router.push({
            path: "order-food",
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
        "HH:ss"
      )}-${this.$moment(task.scheduleEnd).format("HH:ss")}`;
      // console.log(this.query);
      this.$router.push({
        path: "check-register",
        query: this.query,
      });
    },
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
    checkFoodDetail(elder) {
      this.$router.push({
        path: "food-ordered",
        query: {
          elderId: elder.elderId,
          elderName: elder.elderName,
          dietAvoid: elder.dietAvoid ? elder.dietAvoid : "正常",
          roomName: elder.roomName,
          bedName: elder.bedName,
        },
      });
    },
    // showActionSheet
    async showActionSheet(data) {
      const res = await this.isLeaveFlow(data.elderId);
      if (res.data) {
        this.types[2].name = "请假管理";
        this.types[2].path = "/orderly/back-confirm";
      } else {
        this.types[2].name = "请假登记";
        this.types[2].path = "/orderly/leave";
      }
      this.show = true;
      this.query = {
        id: data.id,
        elderId: data.elderId,
        roomId: data.roomId,
        elderName: data.elderName,
        elderPhoto: data.elderPhoto,
        dietAvoid: data.dietAvoid ? data.dietAvoid : "正常",
        bedName: data.bedName,
        roomName: data.roomName,
        nursingLevel: data.nursingLevel,
        isNew: data.isNew,
      };
    },
    // 动作面板
    handleSelect(action) {
      this.$router.push({
        path: action.path,
        query: this.query,
      });
    },
    // 根据老人id查询是否在请假流程中
    isLeaveFlow(elderId) {
      return axios.fetch("elderServer", "/elderLeave/get/isLeaveFlow", {
        elderId,
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
// @import "../assets/styles/common.less";
.main {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  /* margin-top: 20px; */
  display: flex;
}

.nav a {
  text-align: center;
  position: relative;
  line-height: 0.5rem;
  display: inline-block;
  text-decoration: none;
  color: #333;
  padding: 0 0.12rem;
  // margin: 0 5px;
  background: #f8f8f8;
}
.nav a.active {
  background-color: #fff !important;
}
.nav a.active::before {
  content: "";
  border: 2px solid #00c744;
  height: 0.2rem;
  position: absolute;
  left: 0;
  top: 0;
  transform: translateY(50%);
}
.nav {
  background: #f8f8f8;
  position: relative;
  display: flex;
  width: 0.94rem;
  height: 100%;
  overflow: auto;
  flex-direction: column;
}
.items {
  position: relative;
  flex: 1;
  overflow: auto;
}
.item {
  position: relative;
}

.elders_detail {
  // padding: 12px 0;
  // display: flex;
  // justify-content: space-between;
  box-sizing: border-box;
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
      top: 50%;
      display: inline-block;
      height: 17px;
      width: 17px;
      transform: translate(-50%, -50%);
      // background-color: #0085dc;
      font-style: normal;
      font-size: 12px;
      // color: #fff;
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
    .van-button {
      div {
        font-size: 0.1rem;
      }
    }
  }
}
.title {
  background: #fff;
  padding: 0.12rem 0.08rem;
}
.room {
  // height: 300px;
  background-color: #fff;
}
/deep/ .van-tag {
  margin-left: 0.08rem;
  height: 0.12rem;
  line-height: 0.12rem;
}
/deep/ .van-dialog {
  .van-dialog__content {
    max-height: 2rem;
    overflow: auto;
  }
}
.detail.van-button {
  height: 0.32rem;
  width: 0.62rem;
  padding: 0;
  .van-button__content {
    font-size: 0.12rem;
    font-weight: 700;
  }
}
</style>