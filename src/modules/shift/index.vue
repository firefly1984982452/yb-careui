<template>
  <div class="shift_index">
    <Back></Back>
    <!-- 交班首页 -->
    <div class="top">
      <span v-for="(item,index) in items" :key="index" @click="handleTabChange(index)" :class="{'active':iscur == index}">
        {{item}}
      </span>
    </div>
    <div class="content">
      <div class="report" @click="detail(item)" v-for="item in list" :key="item.id">
        <van-tag type="primary">{{item.workTimeName}}</van-tag>
        <p>
          <span>{{item.areaName}}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{item.reportDate}}</span>
        </p>
        <p>
          生成时间：{{item.createTime.substr(11,5)}}，共{{item.num}}条记录
        </p>
        <p class="van-ellipsis">
          <span >{{item.leaderName}}</span>
          <span style="float:right;color:#3e8ef7">查看></span>
        </p>
      </div>
    </div>
    <div class="bottom">
      <van-button block type="primary" @click="handleClick">新增交班报告</van-button>

    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "ShiftIndex",
  data() {
    return {
      items: ["我的", "全部"],
      iscur: 0,
    };
  },
  components: {},
  watch: {
    iscur(newValue, oldValue) {
      const isMyReport = newValue ? false : true;
      this.queryShiftReport(isMyReport);
    },
  },
  created() {
    const isMyReport = this.iscur ? false : true;
    this.queryShiftReport(isMyReport);
  },
  methods: {
    // 处理切换
    handleTabChange(index) {
      this.iscur = index;
    },
    /**查询交班报告
     *
     * isMyReport---true = 我的 & false = 全部
     * id---交班报告id
     * pageIndex---当前页
     * pageSize---最大页
     */
    queryShiftReport(isMyReport) {
      const param = {
        isMyReport: isMyReport,
        pageIndex: 1,
        pageSize: 9999,
      };
      axios.fetch("careServer", "/carePatrolReport/all", param).then((res) => {
        this.list = res.data.map(val => {
          val.nextCarersList = val.nextCarers.split(',');
          val.currentCarersList = val.currentCarers.split(',');
          val.patrolReportDetailsLength = val.patrolReportDetails ? val.patrolReportDetails.length : 0;
          return val;
        });
        this.$forceUpdate();
      });
    },
    // 进入添加页
    handleClick() {
      // 进入添加页还是详情页
      localStorage.setItem('report-type', 'add');
      // 详情页ID传递
      localStorage.setItem('addWorkInfo',null);
      localStorage.removeItem('addInfo')
      this.$router.push("add-report");
    },
    detail(val){
      // 详情页ID传递
      localStorage.setItem('addWorkInfo',JSON.stringify(val));
      // 从首页进入详情页还是从上一步进入详情页
      localStorage.setItem('in-type', 'home');
      // 进入添加页还是详情页
      localStorage.setItem('report-type', 'detail');
      this.$router.push("add-report");
    },
  },
};
</script>

<style lang="less" scoped>
.shift_index {
  display: flex;
  flex-direction: column;
  height: 100%;
  .top {
    display: flex;
    background-color: #fff;
    height: 0.44rem;
    span {
      flex: 1;
      height: 100%;
      line-height: 0.44rem;
      text-align: center;
      font-weight: 600;
      position: relative;
    }
    span.active::after {
      content: "";
      height: 4px;
      width: 20%;
      border-radius: 3px;
      background-color: #3e8ef7;
      position: absolute;
      bottom: 0;
      left: 40%;
    }
  }
  .content {
    overflow: auto;
    flex: 1;
    padding: 0.12rem 0.12rem 0;
    .report {
      background-color: #fff;
      position: relative;
      padding: 0.08rem;
      p {
        margin: 0;
        line-height: 0.32rem;
      }
      .van-tag {
        position: absolute;
        right: 0;
        top: 0;
      }
      .van-ellipsis {
        color: rgba(0, 0, 0, 0.4);
        span + span {
          margin-left: 0.04rem;
        }
      }
    }
    .report + .report {
      margin-top: 0.12rem;
    }
  }
  .bottom {
    margin-top: 0.12rem;
    padding: 0 0.08rem;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 0.56rem;
    button {
      border-radius: 0.08rem;
    }
  }
}
</style>
