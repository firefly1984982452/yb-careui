<template>
  <div class="record">
    <Back></Back>
    <!-- 巡视记录 -->
    <div class="top">
      <span :class="{'van-dropdown-menu__title':true,'van-dropdown-menu__title--active':dateShow,'van-dropdown-menu__title--down':dateShow}" @click="dateShow = true" class="date">
        {{$moment(purchaseDate).format('MM/DD')}}
      </span>
      <span>
        <van-dropdown-menu>
          <van-dropdown-item v-model="areaValue" :options="areas" />
        </van-dropdown-menu>
      </span>
      <span>
        <van-dropdown-menu>
          <van-dropdown-item v-model="turn" :options="turns" @change="handleStatusChange" />
        </van-dropdown-menu>
      </span>
    </div>
    <p style="padding:0 0.12rem;line-height:0.32rem;height:0.32rem;">共{{total}}记录</p>
    <van-list v-model="loading" class="main" v-if="records.length>0" :finished="finished" finished-text="没有更多了" @load="queryRecords">
      <!-- <div class="main" v-if="records.length>0"> -->
      <div class="content" v-for="(record,index) in records" :key="index">
        <p>
          <span class="name">{{record.elderName}}</span>
          <span>{{record.roomName}}-{{record.bedName}}</span>
          <span v-if="record.tags">{{ record.tags }}</span>
          <!-- <i v-if="type=='home'" @click="handleDelete(record)" class="iconfont icontubiao-jichutubiao-shanchu-mianxing3x"></i> -->
        </p>
        <p>
          {{record.description|descriptionFilter}}
        </p>
        <p>
          <span>{{record.operatorName}}&nbsp;&nbsp;{{record.operateTime}}</span>
          <span v-if="type=='home'" @click="handleDelete(record,index)" style="float:right;font-weight:600;color:#666666;margin-left:0.08rem;">
            <i class="iconfont icontubiao-jichutubiao-shanchu-mianxing3x"></i>
            &nbsp;&nbsp;删除
          </span>
          <span v-if="type=='home'" @click="handleEdit(record)" style="float:right;font-weight:600;color:#666666">
            <i class="iconfont iconcaozuotubiao-bianji-xuanfu"></i>
            &nbsp;&nbsp;修改
          </span>
        </p>
        <!-- </div> -->
      </div>
    </van-list>
    <van-empty v-else description="暂无记录" />
    <!-- <bottom></bottom> -->
    <van-calendar :allow-same-day="true" :min-date="minDate" v-model="dateShow" :show-confirm="false" @confirm="onConfirm" />
  </div>
</template>

<script type="text/javascript">
import DatePicker from "@/components/datePicker";
import Empty from "@/components/Empty";
export default {
  name: "Record",
  props: {
    type: {
      type: String,
      default: "orderly",
    },
  },
  data() {
    return {
      minDate: new Date(2010, 0, 1),
      dateShow: false,
      loading: false,
      finished: false,
      records: [],
      purchaseDate: this.$moment().format("YYYY-MM-DD"),
      turn: "",
      turns: [
        {
          text: "全部班次",
          timeStart: 0,
          timeEnd: 24,
          value: "",
        },
      ],
      areaValue: "",
      areas: [
        {
          text: "全部区域",
          value: "",
        },
      ],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
    };
  },
  components: { DatePicker, Empty },
  created() {
    this.getEaras();
    this.queryRecords();
    // this.getTurns();
  },
  watch: {
    areaValue(newValue) {
      this.turns = [
        {
          text: "全部班次",
          timeStart: 0,
          timeEnd: 24,
          value: "",
        },
      ];
      this.turn = "";
      this.pageSize = 10;
      this.pageIndex = 1;
      this.total = 0;
      this.records = [];
      this.getWorkTime(newValue);
      this.queryRecords();
    },
  },
  methods: {
    // 获取区域
    getEaras() {
      axios
        .fetch("oaServer", "/org/area/list", { groups: "楼宇区域" })
        .then((res) => {
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              const obj = {};
              obj.text = item.areaName;
              obj.value = item.areaId;
              this.areas.push(obj);
            });
          }
        });
    },
    edit(record) {
      console.log(record);
    },
    handleStartTime(type) {
      this.type = type;
      this.dateShow = true;
    },
    /** 时间选择事件 */
    onConfirm(date) {
      this.dateShow = false;
      this.purchaseDate = this.$moment(date).format("YYYY-MM-DD");
      this.pageSize = 10;
      this.pageIndex = 1;
      this.total = 0;
      this.records = [];
      this.queryRecords();
    },
    // get turns
    // getTurns() {
    //   const api = !this.$route.query.sign
    //     ? "/carePatrolItem/get/workTime"
    //     : "/carePatrolItem/careLeader/get/workTime";
    //   axios.fetch("careServer", api).then((res) => {
    //     console.log(res);
    //     if (res.data && res.data.length > 0) {
    //       res.data.forEach((item) => {
    //         const obj = {};
    //         obj.text = item.timeName;
    //         obj.value = item.startTime + "-" + item.endTime + "-" + item.timeId;
    //         obj.start = item.startTime;
    //         obj.end = item.endTime;
    //         this.turns.push(obj);
    //       });
    //       var now = this.$moment().format("HH:mm");
    //       this.turns.forEach((val) => {
    //         if (val.start <= now && val.end >= now) {
    //           this.turn = val.value;
    //         }
    //       });
    //       this.turn = this.turn === "" ? this.turns[0].value : this.turn;
    //       this.queryRecords();
    //     }
    //   });
    // },
    // 获取所有班次
    getWorkTime(areaId) {
      if (areaId) {
        axios
          .fetch("careServer", "/carePatrolWork/all", { areaId })
          .then((res) => {
            res.data.forEach((item) => {
              const obj = {};
              obj.text = item.timeName;
              obj.value = item;
              this.turns.push(obj);
            });
          });
      } else {
        this.turns = [
          {
            text: "全部班次",
            timeStart: 0,
            timeEnd: 24,
            value: "",
          },
        ];
      }
    },
    // query check records
    queryRecords() {
      // if (this.loading) {
      const api = this.$route.query.sign
        ? "/carePatrolItem/careLeader/get/byWorkTime"
        : "/carePatrolItem/get/byWorkTime";
      axios
        .fetch("careServer", api, {
          pageIndex: this.pageIndex++,
          pageSize: this.pageSize,
          date: this.purchaseDate,
          areaId: this.areaValue,
          startTime: this.turn ? this.turn.timeStart : 0,
          endTime: this.turn ? this.turn.timeEnd : 24,
        })
        .then((res) => {
          this.loading = false;
          this.records = this.records.concat(res.data);
          this.total = res.total;
          console.log(this.records.length, "======", this.total);
          if (this.records.length === this.total) {
            this.finished = true;
          } else {
            this.finished = false;
          }
        });
      // }
    },
    // handle delete
    handleDelete(record, index) {
      this.$dialog
        .confirm({
          title: "删除记录",
          message: "是否要删除该巡视记录?",
        })
        .then(() => {
          // on confirm
          const id = record.id;
          axios
            .fetch("careServer", "/carePatrolItem/delete", {
              id: id,
            })
            .then((res) => {
              this.$toast(res.data);
              // this.total--;
              // this.records.splice(index, 1);
              this.pageIndex = 1;
              this.total = 0;
              this.records = [];
              this.queryRecords();
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    //
    handleStatusChange() {
      console.log(this.turn);
      this.pageSize = 10;
      this.pageIndex = 1;
      this.total = 0;
      this.records = [];
      this.queryRecords();
    },
    // handle edit record
    handleEdit(record) {
      this.$router.push({
        path: "/orderly/check-register",
        query: {
          id: record.id,
          timeName: `${this.$moment(record.scheduleStart).format(
            "HH:mm"
          )}-${this.$moment(record.scheduleEnd).format("HH:mm")}`,
          sign: "护理班长",
        },
      });
    },
  },
  filters: {
    descriptionFilter: function (value) {
      return value ? value : "无";
    },
  },
};
</script>

<style lang="less" scoped>
.record {
  height: 100%;
  //   overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  p {
    margin: 0;
  }
  .top {
    // color: #fff;
    background-color: #fff;
    height: 0.44rem;
    padding-left: 0.16rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // .date {
    //   text-align: center;
    //   padding: 0.04rem 0.04rem;
    //   border:1px solid #fff;
    // }
    > span {
      width: 30%;
    }
    /deep/ .van-dropdown-menu__bar {
      // height: 100%;
      .van-dropdown-menu__title {
        // color: #fff;
      }
      // background-color: #8ec2ff;
      height: 0.44rem;
      border: none;
      box-shadow: none;
    }
  }
  /deep/ .van-list {
    background-color: #f8f8f8;
  }
  .main {
    flex: 1;
    // margin-top: 0.44rem;
    height: 100%;
    overflow: auto;
    .content {
      border-radius: 8px;
      padding: 0 0.08rem;
      // margin-top: 0.12rem;
      color: rgba(0, 0, 0, 0.4);
      font-size: 0.14rem;
      p {
        padding: 0 0.12rem;
        background-color: #fff;
      }
      p:nth-child(1) {
        //   line-height: 0.44rem;
        padding: 0.12rem 0 0.112rem 0.12rem;
        position: relative;
        .name {
          font-size: 0.17rem;
          color: #222222;
          font-weight: 600;
          padding-right: 0.08rem;
        }
        span:nth-child(3) {
          color: #5bdc88;
          margin-left: 0.08rem;
          // position: absolute;
          // font-size: 0.13rem;
          // color: #fff;
          // right: 0;
          // padding: 0.02rem 0.08rem;
          // top: 50%;
          // transform: translateY(-50%);
          // border-radius: 15px 0 0 15px;
          // background-color: #5bdc88;
        }
        i {
          float: right;
          margin-right: 0.12rem;
        }
      }
      p:nth-child(2) {
        line-height: 0.22rem;
        padding: 0.08rem 0.12rem;
        letter-spacing: 0.1em;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      p:nth-child(3) {
        line-height: 0.44rem;
        font-size: 0.12rem;
      }
    }
    .content + .content {
      margin-top: 0.08rem;
    }
  }
  /deep/ .van-list {
    overflow: auto;
    .van-list__finished-text {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
}
</style>
