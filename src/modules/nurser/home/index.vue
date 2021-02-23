<template>
  <div class="nurse_index">
    <div class="header">
      <p v-if="hour > 0 && hour < 12">上午好!</p>
      <p v-else-if="hour > 12 && hour < 18">下午好!</p>
      <p v-else>晚上好!</p>
      <div class="main">
        <div class="pending">
          <p>
            <i class="iconfont iconjichutubiao-dengdaizhong"></i>
            <span>执行中</span>
          </p>
          <div class="header_main">
            <p v-if="pendingDuties.length>0">
              <span class="number">{{pendingDuties[0].minutes}}</span>
              分钟
            </p>
            <van-progress v-if="pendingDuties.length>0" :percentage="`${pendingDuties[0].perProportion*100}`" color="#4E98FE" stroke-width="8" />
            <img v-else :src="require('@/assets/img/pic-zanwurenwu@2x.png')" alt="">
          </div>
          <p v-if="pendingDuties.length>0" style="text-align:center;">巡视时间</p>
          <!-- <p v-else style="text-align:center;">暂无任务</p> -->
        </div>
        <div class="error" @click="checkError">
          <p>
            <i class="iconfont iconcaozuotubiao-baojing-zhengchang"></i>
            <span>任务异常</span>
          </p>
          <div class="header_main">
            <p>
              <span class="number">{{ unnormalTaskNum }}</span>
              个
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="check_record">
      <p>
        <span>巡视记录</span>
        <span @click="seeMoreRecords">更多>></span>
        <!-- <span v-if="recordsLength>5" @click="seeMoreRecords">更多>></span> -->
      </p>
      <div>
        <ul v-if="recordsLength>0">
          <li v-for="record in records" :key="record.id">
            <van-image round width="0.48rem" height="0.48rem" :src="record.elderPhoto?record.elderPhoto:require('@/assets/img/icon-bed-default.png')" />
            <div>
              <p>{{record.elderName}}</p>
              <p>{{record.roomName}}</p>
            </div>
          </li>
        </ul>
        <van-empty v-else description="暂无记录" />
      </div>
    </div>
    <div class="mian_container">
      <p class="title">每日任务
        <!-- <span style="float:right;color:rgba(0,0,0,.4);font-weight:normal;">更多>>
          </span> -->
      </p>
      <section v-for="(duty,index) in dailyDuties" :key="index" class="pending_body">
        <!-- <p>{{ banci.time }}</p> -->
        <!-- <div v-for="(item,i) in banci.content" :key="i" > -->
        <!-- <div class="cont_body"> -->
        <div class="left">
          <img :src="duty.imageUrl?duty.imageUrl:require('@/assets/img/default.png')" alt="">
          <!-- <span>{{duty.targetName}}</span> -->
        </div>
        <div class="description">
          <span class="title">{{duty.itemTitle}}</span>
          <span class="schedule">
            {{$moment(duty.scheduleStart).format('MM/DD HH:mm')}}~{{$moment(duty.scheduleEnd).format('MM/DD HH:mm')}}
          </span>
          <span>
            {{duty.list.join(' ')}}
          </span>
          <!-- </div> -->
        </div>
        <!-- </div> -->
      </section>
    </div>
    <van-dialog v-model="errorDialogShow" @confirm="handleConfirm" class="error_dialog" title="异常信息提醒" show-cancel-button cancelButtonText="关闭" confirmButtonText="清除提醒">
      <!-- <img src="https://img.yzcdn.cn/vant/apple-3.jpg" /> -->
      <p>
        <span>项目</span>
        <span>翻身</span>
      </p>
      <p>
        <span>时段</span>
        <span>2020/06/15(13:00-15:00)</span>
      </p>
      <p>
        <span>异常类型</span>
        <span>无记录</span>
      </p>
      <p>
        <span>对象</span>
        <span>
          <div>张大爷(2202-6)</div>
          <div>张大爷(2202-6)</div>
        </span>
      </p>
    </van-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "NurseIndex",
  data() {
    return {
      hour: "",
      pendingDuties: [],
      errorDatas: [],
      dailyDuties: [],
      recordsLength: 0,
      errorDialogShow: false,
      unnormalTaskNum: 0,
    };
  },
  components: {},
  created() {
    this.querySubTask();
    this.queryRecords();
    this.queryTasks();
    this.queryUnnormalTask();
    this.hour = new Date().getHours();
    console.log(this.hour);
  },
  methods: {
    // 显示异常弹框
    showDialog() {
      this.errorDialogShow = true;
    },
    // handleConfirm
    handleConfirm() {
      console.log("....");
    },
    // 查看更多巡视记录
    seeMoreRecords() {
      this.$router.push("check-records");
    },
    // 获取执行中的子任务
    querySubTask() {
      axios
        .fetch("careServer", "/carePatrolSubtask/get/alreadyStart")
        .then((res) => {
          console.log(res);
          if (res.data && res.data.length > 0) {
            this.pendingDuties = res.data;
          }
        });
    },
    // unnormal task query
    queryUnnormalTask() {
      axios.fetch("oaServer", "/oaMessage/get/byTypeReceiverId").then((res) => {
        this.unnormalTaskNum = res.total;
      });
    },
    checkError() {
      if (this.unnormalTaskNum !== 0) {
        this.$router.push("unnormal-task");
      } else {
        this.$toast("暂无异常");
      }
    },
    // query check records
    queryRecords() {
      axios
        .fetch("careServer", "/carePatrolItem/get/byWorkTime", {
          date: this.$moment().format("YYYY-MM-DD"),
          // date:'2020-08-20',
          timeStart: 0,
          timeEnd: 24,
        })
        .then((res) => {
          this.recordsLength = res.data.length;
          this.records = res.data && res.data.length > 0 ? res.data : [];
        });
    },
    // 智慧护理首页查询每日任务
    queryTasks() {
      axios.fetch("careServer", "/careTask/day").then((res) => {
        console.log(res);
        // this.dailyDuties = res.data && res.data.length > 0 ? res.data : [];
        const arr = [];
        if (res.data && res.data.length > 0) {
          let obj = {
            serviceId: res.data[0].serviceId,
            scheduleStart: res.data[0].scheduleStart,
            scheduleEnd: res.data[0].scheduleEnd,
            imageUrl: res.data[0].imageUrl,
            itemTitle: res.data[0].itemTitle,
            list: [],
          };
          res.data.forEach((item, index) => {
            if (obj.serviceId === item.serviceId) {
              obj.list.push(item.targetName);
            } else {
              arr.push(obj);
              obj = {
                serviceId: item.serviceId,
                scheduleStart: item.scheduleStart,
                scheduleEnd: item.scheduleEnd,
                imageUrl: item.imageUrl,
                itemTitle: item.itemTitle,
                list: [item.targetName],
              };
            }
          });
          this.dailyDuties = arr;
          console.log(this.pendingDuties);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
p {
  margin: 0;
  padding: 0;
}
.title {
  font-size: 0.14rem;
  font-weight: 700;
}
.nurse_index {
  height: 100%;
  overflow: auto;
  .header {
    box-sizing: border-box;
    height: 1.38rem;
    background-color: #69ca8d;
    padding: 0.08rem 0.16rem;
    > p {
      font-size: 0.24rem;
      color: #fff;
      line-height: 0.64rem;
    }
    position: relative;
    .main {
      border-radius: 0.08rem;
      height: 1.2rem;
      // position: absolute;
      // bottom: -0.4rem;
      display: flex;
      background-color: #fff;
      // text-align: center;
      > div {
        padding: 0.08rem 0.22rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        > p {
          line-height: 0.26rem;
          height: 0.26rem;
          color: #666666;
          i {
            color: #4e98fe;
          }
        }
        .header_main {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          .number {
            color: #4e98fe;
            font-size: 0.4rem;
          }
          img {
            height: 0.6rem;
            // width: 0.4rem;
          }
          /deep/ .van-progress {
            position: none;
            transform: rotate(-90deg);
            height: 12px !important;
            width: 25%;
            .van-progress__pivot {
              display: none;
            }
          }
        }
      }
      .pending {
        border-right: 1px dashed #ccc;
        > p {
          i {
            color: #4e98fe;
          }
        }
      }
      .error {
        > p {
          i {
            color: #ff6f6c;
          }
        }
        .number {
          color: #ff6f6c !important;
        }
      }
    }
  }
  .error_dialog {
    /deep/ .van-dialog__header {
      padding: 0;
      line-height: 0.44rem;
      font-weight: 600;
      font-size: 0.15rem;
    }
    .van-dialog__content {
      > p {
        line-height: 0.44rem;
        display: flex;
        span:nth-child(1) {
          flex: 1;
          text-align: right;
          color: rgba(0, 0, 0, 0.4);
        }
        span:nth-child(2) {
          padding-left: 0.08rem;
          flex: 3;
        }
      }
    }
  }
  .check_record {
    // color: rgba(0, 0, 0, 0.4);
    background-color: #fff;
    margin-top: 0.64rem;
    > p {
      position: relative;
      padding: 0 0.12rem 0 0.24rem;
      line-height: 0.56rem;
      display: flex;
      justify-content: space-between;
      span:nth-child(1) {
        font-weight: 600;
      }
      span:nth-child(2) {
        color: rgba(0, 0, 0, 0.4);
      }
    }
    > p::before {
      content: "";
      width: 0.05rem;
      height: 0.14rem;
      background-color: #69ca8d;
      position: absolute;
      left: 0.12rem;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 0.02rem;
    }
    ul {
      padding: 0.08rem 0.12rem;
      // width: 100%;
      overflow-x: scroll;
      display: -webkit-box;
      display: flex;
      -webkit-flex-wrap: nowrap;
      flex-wrap: nowrap;
      li {
        float: left;
        box-sizing: border-box;
        justify-content: center;
        display: flex;
        font-size: 0.12rem;
        width: 1.2rem;
        flex: none;
        height: 0.64rem;
        align-items: center;
        border-radius: 4px;
        box-shadow: 0 2px 4px 2px #f5f4f9;
        p {
          padding: 0.04rem;
        }
        > div {
          p:nth-child(2) {
            color: #999999;
          }
        }
      }
    }
  }
  .mian_container {
    margin-top: 0.12rem;
    background-color: #fff;
    > p {
      padding: 0 0.12rem 0 0.24rem;
      position: relative;
      line-height: 0.44rem;
    }
    > p::before {
      content: "";
      width: 0.05rem;
      height: 0.14rem;
      background-color: #69ca8d;
      position: absolute;
      left: 0.12rem;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 0.02rem;
    }
    section.pending_body {
      width: 100%;
      > p {
        line-height: 0.44rem;
        font-weight: 600;
        font-size: 0.15rem;
        color: rgba(0, 0, 0, 0.6);
      }
      background-color: #fff;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      // .pending_body {
      width: 100%;
      // height: 0.84rem;
      box-sizing: border-box;
      // .cont_body {
      display: flex;
      // align-items: center;
      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0.08rem;
        img {
          display: inline-block;
          width: 0.56rem;
          height: 0.56rem;
        }
      }
      .description {
        flex: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        justify-content: center;
        position: relative;
        > span:nth-child(2) {
          position: absolute;
          padding: 0.02rem;
          right: 0;
          top: 0;
          color: rgba(0, 0, 0, 0.4);
          background-color: #eeee;
        }
        > span:nth-child(3) {
          display: inline-block;
          color: rgba(0, 0, 0, 0.4);
          line-height: 0.26rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        // }
        // }
      }
    }
  }
}
</style>
