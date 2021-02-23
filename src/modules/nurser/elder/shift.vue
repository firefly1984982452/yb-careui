<template>
  <div class="look_over">
    <!-- <div class="date">
      <span class="startTime" @click="handleStartTime('start')">
        <img src="../../../assets/img/clander.png" alt="">
        <span>{{startTime}}</span>
      </span>
      <span class="to">-</span>
      <span class="endTime" @click="handleStartTime('end')">
        <img src="../../../assets/img/clander.png" alt="">
        <span>{{endTime}}</span>
      </span>
    </div> -->
    <div class="data">
      <ul class="sum">
        <li>16<b>总人数</b></li>
        <li>14<b>实人数</b></li>
        <van-icon v-if="show" @click="show=false" name="arrow-down" />
        <van-icon v-else @click="show=true" name="arrow-up" />
      </ul>
      <ul class="detail_data" v-if="!show">
        <li v-for="item in 8">
          <p>{{item}}</p>
          <p>{{item}}</p>
        </li>
      </ul>
    </div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="content" v-for="(record,index) in records" :key="index">
        <p>
          <span class="name">{{record.elderName}}</span>
          <span>{{record.roomName}}-{{record.bedName}}</span>
          <span v-if="record.remark">{{ record.remark }}</span>
        </p>
        <p>
          {{record.content}}
        </p>
        <p>
          <span>{{record.operater}}&nbsp;&nbsp;{{record.date}}</span>
          <span @click="edit(record)"> <i @click="edit(record)" class="iconfont iconcaozuotubiao-bianji"></i>修改</span>
        </p>
      </div>
    </van-list>
    <bottom></bottom>
    <DatePicker :dateShow="dateShow" :type="'datetime'" @cancelFn="cancelFn" @confirmFn="confirmFn"></DatePicker>
  </div>
</template>

<script type="text/javascript">
import DatePicker from "@/components/datePicker";
export default {
  name: "LookOver",
  data() {
    return {
      show: true,
      dateShow: false,
      type: "",
      loading: false,
      finished: false,
      startTime: "",
      endTime: "",
      records: [
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "2",
          operater: "李海棠",
          remark: "新入院",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
        {
          elderName: "李海棠",
          roomName: "2202",
          bedName: "3",
          operater: "李海棠",
          content:
            "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
          date: "2020-06-12 15:00",
        },
      ],
    };
  },
  components: { DatePicker },
  created() {
    this.startTime = this.$moment().format("MM月DD日 HH:mm");
    this.endTime = this.$moment().format("MM月DD日 HH:mm");
  },
  methods: {
    edit(record) {
      console.log(record);
    },
    handleStartTime(type) {
      this.type = type;
      this.dateShow = true;
    },
    /** 时间选择事件 */
    confirmFn(data) {
      // 确定按钮
      if (this.type == "start") {
        this.startTime = this.$moment(data).format("MM月DD日 HH:mm");
      }
      if (this.type == "end") {
        this.endTime = this.$moment(data).format("MM月DD日 HH:mm");
      }
      this.dateShow = false;
    },
    cancelFn() {
      this.dateShow = false;
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.records.push({
            elderName: "李海棠",
            roomName: "2202",
            bedName: "3",
            operater: "李海棠",
            content:
              "九十点附近开了福克斯的开发建设地方经济距离喀什酱豆腐考虑的JFK了解了",
            date: "2020-06-12 15:00",
          });
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 18) {
          this.finished = true;
        }
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.look_over {
  //   height: 100%;
  //   overflow: hidden;
  box-sizing: border-box;
  p {
    margin: 0;
  }
  // .date {
  //   padding: 0 0.12rem;
  //   height: 0.54rem;
  //   background-color: #fff;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   .startTime,
  //   .endTime {
  //     height: 0.3rem;
  //     width: 47%;
  //     border: 1px solid rgba(0, 0, 0, 0.1);
  //     border-radius: 5px;
  //     display: flex;
  //     align-items: center;
  //     box-sizing: border-box;
  //     padding: 0.08rem 0.12rem;
  //     img {
  //       height: 0.17rem;
  //       width: 0.17rem;
  //       margin-right: 0.12rem;
  //     }
  //   }
  // }
  .data {
    background-color: #fff;
    .sum {
      height: 0.56rem;
      display: flex;
      text-align: center;
      align-items: center;
      li {
        flex: 1;
        font-size: 0.22rem;
        b {
          font-size: 0.12rem;
          color: rgba(0, 0, 0, 0.4);
        }
      }
      i {
        margin-right: 0.12rem;
        font-size: 0.16rem;
      }
    }
    .detail_data {
      display: flex;
      flex-wrap: wrap;
      text-align: center;
      li {
        height: 0.44rem;
        width: 25%;
        p {
          line-height: 0.22rem;
          height: 0.22rem;
          font-size: 0.16rem;
          font-weight: 600;
        }
        p:nth-child(2) {
          font-size: 0.14rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
  /deep/ .van-list {
    background-color: #f8f8f8;
  }
  .content {
    border-radius: 0.4rem;
    padding: 0.12rem 0.12rem 0 0.12rem;
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
        position: absolute;
        font-size: 0.13rem;
        color: #fff;
        right: 0;
        padding: 0.02rem 0.08rem;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 15px 0 0 15px;
        background-color: #5bdc88;
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
      display: flex;
      justify-content: space-between;
      span:nth-child(2){
        color: #5bdc88;
      }
    }
  }
}
</style>
