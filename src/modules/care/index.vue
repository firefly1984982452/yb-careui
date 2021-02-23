<template>
  <div class="coast" @click.stop="show=false">
    <Back></Back>
    <div class="top">
      <div class="header">
        <!-- <ul class="left">
        <li v-for="(item, index) in tabList" :key="index" @click="tabChange(index,item)" :class="{active:index == iscur}">{{item}}</li>
      </ul> -->
        <div class="left">
          <van-dropdown-menu>
            <van-dropdown-item v-model="area" :options="areas" @change="handleEreaChange" />
          </van-dropdown-menu>
        </div>
        <!-- <span class="middle">{{ timeParam }}</span> -->
        <div class="right">
          <!-- <span class="menu" @click.stop="handleMenuShow">
            <Menu :show="show"></Menu>
          </span> -->
          <!-- <span class="menu" @click.stop="handleMenuShow"><img src="../../assets/img/menu.png" alt=""></span> -->
          <span class="date" style="font-size:0.14rem;" @click="dateShow = true">{{ $moment(timeParam).format("DD") }}</span>
        </div>
        <!-- <ul class="nav-menu" v-show="show">
          <li @click="logout">首页</li>
          <li>消费</li>
          <li>我的</li>
        </ul> -->
      </div>
      <div class="classics">
        <ul>
          <li v-for="(item,i) in classics" :class="{'active':categoryType == item.itemValue}" @click="handleActive(item,i)" :key="i">{{ item.itemValue }}</li>
        </ul>
      </div>
    </div>
    <!-- <Menu :show="show" /> -->
    <div class="content">
      <div class="empty" v-if="listData.length == 0">
        <div>
          <img src="../../assets/img/none.png" alt="">
          <p>暂无内容</p>
        </div>
      </div>
      <van-collapse v-else v-model="activeName" accordion>
        <van-collapse-item v-if="categoryType == classicWordings[0]" :name="i" v-for="(item,i) in listData" :key="i">
          <template #title>
            <div>
              <span class="span_1">{{item.goodsTitle}}</span>
              <span class="span_2">{{item.elders}}人</span>
              <span class="span_3">{{item.quantity}}{{item.priceUnit}}</span>
              <!-- <van-icon name="question-o" /> -->
            </div>
          </template>
          <template>
            <van-swipe-cell v-for="(detail,index) in item.resultDetailItemVos" :key="index" class="detail">
              <template>
                <span>{{detail.elderName}}{{detail.roomName}}-{{detail.bedName}}</span>
                <span>￥{{detail.amount}}</span>
                <span>{{detail.quantity}}{{detail.priceUnit}}</span>
                <!-- <span style="visible:hidden;min-width:1em;margin-left:5px;"></span> -->
              </template>
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" @click="beforeClose(i,index,detail)" />
              </template>
            </van-swipe-cell>
          </template>
        </van-collapse-item>
        <van-collapse-item v-if="categoryType == classicWordings[2]" :name="i" v-for="(item,i) in listData" :key="i">
          <template #title>
            <div>
              <span class="span_1">{{item.goodsTitle}}</span>
              <span class="span_2">{{item.elders}}人</span>
              <span class="span_3">￥{{item.amounts}}</span>
              <!-- <van-icon name="question-o" /> -->
            </div>
          </template>
          <template>
            <van-swipe-cell v-for="(detail,index) in item.resultDetailItemVos" :key="index" class="detail">
              <template>
                <span>{{detail.elderName}}{{detail.roomName}}-{{detail.bedName}}</span>
                <span>￥{{detail.amount}}</span>
                <span v-if="detail.endTime">{{ $moment(detail.startTime).format('MM/DD')}}-{{ $moment(detail.endTime).format("MM/DD") }}</span>
                <span v-if="detail.startTime&&!detail.endTime">{{ $moment(detail.startTime).format('MM/DD')}}</span>
                <!-- <span style="visible:hidden;min-width:1em;margin-left:5px;"></span> -->
              </template>
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" @click="beforeClose(i,index,detail)" />
              </template>
            </van-swipe-cell>
          </template>
        </van-collapse-item>
        <van-collapse-item v-if="categoryType == classicWordings[1]" :name="i" v-for="(item,i) in listData" :key="i">
          <template #title>
            <div>
              <span class="span_1">{{item.goodsTitle}}</span>
              <span class="span_2">{{item.elders}}人</span>
              <span class="span_3">￥{{item.amounts}}</span>
              <!-- <van-icon name="question-o" /> -->
            </div>
          </template>
          <template>
            <van-swipe-cell v-for="(detail,index) in item.resultDetailItemVos" :key="index" class="detail">
              <template>
                <span>{{detail.elderName}}{{detail.roomName}}-{{detail.bedName}}</span>
                <span>{{detail.quantity}}{{detail.priceUnit}}</span>
                <span>￥{{detail.amount}}</span>
                <!-- <span style="visible:hidden;min-width:1em;margin-left:5px;"></span> -->
              </template>
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" @click="beforeClose(i,index,detail)" />
              </template>
            </van-swipe-cell>
          </template>
        </van-collapse-item>
        <van-collapse-item v-if="categoryType == classicWordings[3]" :name="i" v-for="(item,i) in listData" :key="i">
          <template #title>
            <div>
              <span class="span_1">{{item.goodsTitle}}</span>
              <span class="span_2">{{item.elders}}人</span>
              <span class="span_3">￥{{item.amounts}}</span>
              <!-- <van-icon name="question-o" /> -->
            </div>
          </template>
          <template>
            <van-swipe-cell v-for="(detail,index) in item.resultDetailItemVos" :key="index" class="detail">
              <template>
                <span>{{detail.elderName}}{{detail.roomName}}-{{detail.bedName}}</span>
                <span>{{detail.quantity}}{{detail.priceUnit}}</span>
                <span>￥{{detail.amount}}</span>
                <!-- <span style="visible:hidden;min-width:1em;margin-left:5px;"></span> -->
              </template>
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" @click="beforeClose(i,index,detail)" />
              </template>
            </van-swipe-cell>
          </template>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="input">
      <input class="input-text" v-model="roomName" v-on:keyup.enter="selecRoom" type="text" placeholder="请输入房间号" />
      <span class="image" @click="selecRoom"><img src="../../assets/img/add.png" alt=""></span>
    </div>
    <!-- <van-popup v-model="dateShow" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" @confirm="confirmFn()" @cancel="cancelFn()" />
    </van-popup> -->
    <DatePicker :dateShow="dateShow" @cancelFn="cancelFn" @confirmFn="confirmFn"></DatePicker>
    <!-- 底部版权 -->
    <bottom />
    <van-dialog v-model="dialogShow" class="error_dialog" title="请选择房间" :show-confirm-button="false" show-cancel-button cancelButtonText="取消">
      <van-cell is-link v-for="(room,index) in roomList" :key="index" :to="`/home/purchase?roomName=${room.roomName}&roomId=${room.roomId}`">
        <template #title>
          <div class="custom-title">
            {{room.buildingName}}/
            {{room.floor}}层/
            {{room.roomName}}
            <!-- --{{room.roomId}} -->
          </div>
          <!-- <div>{{task.timeName}}</div> -->
        </template>
      </van-cell>
    </van-dialog>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
import store from "@/store";
import types from "@/store/types";
import axios from "axios";
import DatePicker from "@/components/datePicker";
export default {
  name: "Coast",
  components: {
    DatePicker
  },
  data() {
    return {
      logined: false,
      show: false,
      index: 0,
      iscur: 0,
      roomName: "",
      activeName: "0",
      categoryType: "生活用品",
      tabList: ["消费", "点餐"],
      currentDate: new Date(), // 事件选择器当前时间
      timeParam: "", //选中的时间的值
      dateShow: false, // 时间选择器显示或者隐藏
      listData: [],
      buildingId: "",
      classics: [],
      classicWordings: [],
      area: 1,
      // 生活区域
      areas: [
        {
          text: "全部区域",
          value: ""
        },
        {
          text: "我的区域",
          value: 1
        }
      ],
      dialogShow: false
    };
  },
  created() {
    this.timeParam = this.$moment(this.currentDate).format("YYYY-MM-DD");
    this.getOptionData();
    this.getBulidList();
    this.getEaras();
    this.getListData();
  },
  watch: {
    show(newValue, oldValue) {
      console.log(newValue);
    }
  },
  computed: {
    ...mapGetters({
      getCurrentUser: types.GetCurrentUser
    })
  },
  methods: {
    // 获取全部区域
    getEaras() {
      axios
        .fetch("oaServer", "/org/area/list", {
          groups: "楼宇区域"
        })
        .then(res => {
          if (res.data.length > 0) {
            res.data.forEach(item => {
              const obj = {};
              obj.text = item.areaName;
              obj.value = item.areaName;
              this.areas.push(obj);
            });
          }
        });
    },
    // 从字典获取列表
    getOptionData() {
      let arr = ["收费项目"];
      axios
        .fetch("commonServer", "/dict/getItemViewsByGroup", {
          groups: arr.join(",")
        })
        .then(res => {
          let data = res.data;
          this.classics = data.filter(
            item => item.itemGroup == "收费项目" && item.parentNo == "消费项"
          );
          // 根据一级分类初始化列表数据
          this.classics.forEach(item => {
            this.classicWordings.push(item.itemNo);
          });
        });
    },
    // 获取楼宇信息
    getBulidList() {
      axios.fetch("oaServer", "/org/building/list").then(res => {
        this.buildingId = res.data[0].buildingId;
      });
    },
    // 查询所有明细
    getListData() {
      axios
        .fetch("careServer", "/careOrderDetail/all", {
          categoryType: this.categoryType,
          timeParam: this.timeParam,
          area: this.area
        })
        .then(res => {
          if (res.code == 200) {
            this.listData = res.data;
            // console.log(this.listData,'===============');
          }
        });
    },
    tabChange(i, data) {
      this.iscur = i;
    },
    // 显示右上角菜单i
    handleMenuShow(data) {
      this.show = this.show ? false : true;
    },
    handleActive(item, i) {
      // console.log(item);

      this.activeName = "";
      this.categoryType = item.itemValue;
      this.getListData();
    },
    // 选择房间号
    async selecRoom() {
      if (this.roomName == "") {
        this.$toast("请输入房间号");
      } else {
        const param = {
          roomName: this.roomName,
          // buildingId: this.buildingId
        };
        const res = await axios.fetch(
          "careServer",
          "/careOrderDetail/isRoom",
          param
        );
        this.roomList = res.data;
        if (this.roomList.length >0) {
          // this.$toast("成功");
          if(this.roomList.length === 1){
            this.$router.push({
              path: "purchase",
              query: {
                roomName: this.roomList[0].roomName,
                roomId: this.roomList[0].roomId,
              }
            });
          } else {
            this.dialogShow = true;
          }
          // this.$router.push({
          //   path: "purchase",
          //   query: {
          //     roomName: this.roomName
          //   }
          // });
        } else {
          this.$toast("房间号不存在");
          return;
        }
      }
    },
    deleteREquest(param, i, index) {
      axios
        .fetch("careServer", "/careOrderDetail/edit", param, "json")
        .then(res => {
          if (res.code == 200) {
            this.listData[i].resultDetailItemVos.splice(index, 1);
            this.$toast.success("删除成功");
            this.getListData();
          }
        });
    },
    // 删除事件
    beforeClose(i, index, item) {
      if (this.categoryType == this.classicWordings[2]) {
        //
        if (!item.isAccounted) {
          const param = {
            status: -1,
            id: item.id,
            amount: item.amount
          };
          this.deleteREquest(param, i, index);
        } else {
          this.$toast("不能删除");
        }
      } else if (
        this.categoryType == this.classicWordings[0] ||
        this.categoryType == this.classicWordings[1]
      ) {
        if (item.status == 1) {
          const message =
            this.categoryType == this.classicWordings[0]
              ? "该物品已发放完成,不能删除"
              : "该物品已购买完成,不能删除";
          this.$toast(message);
        } else {
          const param = {
            status: -1,
            id: item.id,
            amount: item.amount
          };
          this.deleteREquest(param, i, index);
        }
      } else {
        const param = {
          status: -1,
          id: item.id,
          amount: item.amount
        };
        this.deleteREquest(param, i, index);
      }
    },
    /** 时间选择事件 */
    confirmFn(data) {
      // 确定按钮
      this.timeParam = this.$moment(data).format("YYYY-MM-DD");
      this.getListData();
      this.dateShow = false;
    },
    cancelFn() {
      this.dateShow = false;
    },
    /** END */
    // 退出
    logout() {
      this.$router.push({name:'PassportLogout'});
    },
    /** 区域筛选 */
    handleEreaChange() {
      this.activeName = "0";
      this.getListData();
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.coast {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .top {
    // position: fixed;
    top: 0;
    width: 100%;
    z-index: 99;
    .header {
      // z-index: 99;
      // width: 100%;
      // position: fixed;
      // top: 0;
      // border-bottom: 1px solid #e5e5e5;
      background-color: #fff;
      height: 0.44rem;
      display: flex;
      .left {
        height: 100%;
        flex: 4;
        @{deep} .van-dropdown-menu {
          width: 50%;
          .van-dropdown-menu__bar {
            box-shadow: none;
          }
        }
        // 原来切换式样
        li {
          height: 100%;
          width: 30%;
          float: left;
          line-height: 0.44rem;
          text-align: center;
          font-size: 0.16rem;
          position: relative;
        }
        li.active {
          color: black;
          font-weight: 500;
        }
        li.active:after {
          content: "";
          border: solid 1px black;
          padding: 0 0.05rem;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .middle {
        flex: 4;
        text-align: center;
        line-height: 0.44rem;
        font-weight: 700;
        font-size: 0.16rem;
      }
      .right {
        // border-bottom: 1px solid #e5e5e5;
        height: 100%;
        flex: 4;
        box-sizing: border-box;
        padding: 0.12rem 0;
        span {
          float: right;
          width: 0.2rem;
          height: 0.2rem;
          // background-color: pink;
          margin-right: 0.16rem;
          img {
            display: block;
            width: 0.2rem;
            height: 0.2rem;
          }
        }
        span.date {
          line-height: 0.2rem;
          text-align: center;
          background: url("../../assets/img/bg.png");
          background-size: 100% 100%;
          // border: 1px solid #333333;
          height: 0.2rem;
          width: 0.2rem;
          margin-right: 16px;
        }
      }
    }
    // 分类
    .classics {
      // position: fixed;
      // z-index: 99;
      // width: 100%;
      // top: 0.44rem;
      background-color: #fff;
      box-sizing: border-box;
      height: 0.56rem;
      ul {
        box-sizing: border-box;
        // height: 0.44rem;
        padding: 0.12rem 5%;
        font-size: 0.16rem;
        line-height: 0.32rem;
        display: flex;
        justify-content: space-between;
        li {
          font-weight: 500;
          box-sizing: border-box;
          height: 0.32rem;
          color: rgba(0, 0, 0);
          // transform: scale(0.8);
          text-align: center;
          width: 23%;
          // padding: 0.08rem;
          border-radius: 0.18rem;
          background-color: #f5f5f5;
        }
        li.active {
          background-color: #00c744;
          color: #fff;
        }
      }
    }
  }
  .content {
    width: 100%;
    position: absolute;
    // top: 1rem;
    top: 1.56rem;
    bottom: 1rem;
    // padding-bottom: 0.88rem;
    box-sizing: border-box;
    overflow: auto;
    .empty {
      flex: 1;
      font-size: 0.16rem;
      position: relative;
      text-align: center;
      height: 100%;
      div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        p {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    @{deep} .van-cell {
      line-height: 0.24rem;
      .van-cell__title {
        font-size: 0.16rem;
        font-weight: 500;
        div {
          padding: 0 0.12rem;
          display: flex !important;
          // justify-content: space-between;
          span {
            display: block;
          }
          .span_1 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 1.2rem;
          }
          .span_2 {
            width: 0.7rem;
            text-align: center;
          }
          .span_3 {
            // width: 1rem;
            flex: 1;
            text-align: center;
          }
        }
      }
      @{deep} .van-cell__right-icon {
        line-height: 0.24rem;
      }
    }

    @{deep} .van-collapse-item__wrapper {
      .van-collapse-item__content {
        // padding: 0;
        // padding-left: 0.24rem;
        padding: 0 0 0 16px;
        background-color: #f7f7f7;
        font-size: 0.14rem;
        .detail {
          .van-swipe-cell__wrapper {
            display: flex !important;
            width: 100% !important;
            padding: 0 12px;
            justify-content: space-between;
            font-size: 0.16rem;
            span:nth-child(1) {
              width: 1.2rem;
            }
            span:nth-child(2) {
              width: 0.7rem;
              // flex: 1;
              text-align: center;
            }
            span:nth-child(3) {
              // width: 1rem;
              flex: 1;
              padding-right: 30px;
              text-align: center;
            }
            .delete-button {
              display: block;
              height: 0.44rem;
              .van-button__content {
                display: block;
                // position: relative;
                line-height: 0.44rem;
              }
            }
          }
          display: flex;
          // padding-right: 0.28rem;
          // padding-left: .12rem;
          justify-content: space-between;
          height: 0.44rem;
          line-height: 0.44rem;
        }
      }
    }
  }
  .input {
    position: fixed;
    bottom: 0.52rem;
    width: 45%;
    height: 0.4rem;
    margin-left: 30%;
    line-height: 0.4rem;
    text-align: center;
    background-color: #fff;
    border-radius: 0.2rem;
    // padding-right: 0.4rem;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3), 0px 0px 20px #fff inset;
    .image {
      display: block;
      position: absolute;
      display: block;
      top: 0;
      right: 0;
      img {
        display: block;
        width: 0.4rem;
        height: 0.4rem;
      }
    }
    .input-text {
      box-sizing: border-box;
      padding-left: 0.16rem;
      width: 80%;
      float: left;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.18rem;
      border: none;
      border-radius: 0.2rem;
      // background-color: #efefef;
    }
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
}
}
</style>
