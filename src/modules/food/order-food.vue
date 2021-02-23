<template>
  <div class="order_food">
    <div class="header">
      <van-icon @click="$router.go(-1)" name="arrow-left" />
      <span>{{$route.query.elderName}}</span>
      （<span style="max-width:30%" class="van-ellipsis">{{$route.query.dietAvoid}}</span>）
      <van-tag type="success" size="large" round>{{$route.query.roomName}}-{{$route.query.bedName}}</van-tag>
    </div>
    <van-tabs  v-if="weeks.length > 0" sticky @click="onClick" v-model="active">
      <van-tab :title="week.name" v-for="(week,index) in weeks" :key="index">
        <Child :tabActive="active" :startDate="week.startDate" :periodStatus="week.periodStatus" :periodId="week.id" />
      </van-tab>
    </van-tabs>
    <van-empty description="暂无发布的菜谱" v-else />
  </div>
</template>

<script type="text/javascript">
import Child from "./child/index";
export default {
  name: "OrderFood",
  data() {
    return {
      active: 0,
      weeks: [],
    };
  },
  components: { Child },
  created() {
    this.getWeekData();
  },
  methods: {
    // 获取已发布的本周或下周的菜单
    getWeekData() {
      axios.fetch("dietServer", "/dietPeriod/careLeader/get").then((res) => {
        this.weeks = res.data.filter((item) => item.status === 1);
        this.weeks.forEach((item) => {
          if (item.periodStatus == 2) {
            item.name = "下周菜单";
          }
          if (item.periodStatus == 1) {
            item.name = "本周菜单";
          }
        });
        // console.log(this.weeks);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.order_food {
  height: 100%;
  .header {
    height: 0.44rem;
    font-size: 0.16rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    display: flex;
    align-items: center;
    background-color: #fff;
    i {
      font-size: 0.22rem;
      margin-right: 0.08rem;
    }
  }
  /deep/ .van-tabs {
    // margin-top: 0.12rem;
    display: flex;
    flex-direction: column;
    height: calc(100% - 0.44rem);
    > div:nth-child(1) {
      height: 44px;
      .van-tabs__wrap {
        // height: 0.44rem;
        .van-tabs__nav {
          margin: 0;
          .van-tab {
            font-size: 0.18rem;
          }
          .van-tab--active {
            color: #69ca8d;
          }
          .van-tabs__line {
            background-color: #69ca8d;
          }
        }
      }
    }
    .van-tabs__content {
      height: calc(100% - 44px);
      .van-tab__pane {
        height: 100%;
      }
    }
  }
}
</style>
