<template>
  <div class="shift_content">
    <div class="content">
      <div class="top" v-show="!showType">
        <div class="left">{{detailInfo.areaName}}</div>
        <div class="right">
          <span>{{detailInfo.reportDate}}</span>
          <van-tag type="primary">{{detailInfo.workTimeName}}</van-tag>
        </div>
        <van-icon name="arrow-down" v-if="show" @click="show=false" />
        <van-icon v-else @click="show=true" name="arrow-up" />
      </div>
      <div class="top" v-if="!show && !showType">
        <div class="left">护理班长</div>
        <div class="right">{{detailInfo.leaderName}}</div>
      </div>
      <div class="top" v-if="!show && !showType">
        <div class="left">交班人员</div>
        <div class="right">
          <span v-for="item in detailInfo.currentCarersList" :key="item">{{item}}</span>
        </div>
      </div>
      <div class="top" v-if="!show && !showType">
        <div class="left">接班人员</div>
        <div class="right">
          <span v-for="item in detailInfo.nextCarersList" :key="item">{{item}}</span>
        </div>
      </div>
      <div class="data">

        <ul class="detail_data detail_data_all">
          <li>
            <p>总人数</p>
            <p>{{detailInfo.itemCount}}</p>
          </li>
          <li>
            <p>实有人数</p>
            <p @click="editDone" style="color:#1677f9">{{detailInfo.doneCount}}</p>
          </li>
        </ul>
        <ul class="detail_data">
          <li v-for="item in detailInfo.patrolReportDetails" :key="item.title">
            <p>{{item.tagCount}}</p>
            <p>{{item.tagName}}</p>
          </li>
        </ul>
      </div>
      <div class="main" v-show="showReport">
        <div class="record" v-for="(record,index) in detailInfo.patrolItemVos" :key="index">
          <p>
            <span class="name">{{record.elderName}}</span>
            <span>{{record.roomName}}-{{record.bedName}}</span>
            <span v-if="record.tags" class="remark">{{ record.tags }}</span>
            <span v-if="record.isNew" class="is-new">新</span>
          </p>
          <p>
            {{record.description}}
          </p>
          <p>
            <span>{{record.operatorName}}&nbsp;&nbsp;{{record.operateTime}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-button style="width:40%" @click="back">返回</van-button>
      <van-button block type="primary" v-show="showType" @click="dialogShow = true">生成交班报告</van-button>
    </div>
    <van-dialog v-model="doneCount" @confirm="comfirmDoneCount" @close="reset"  show-cancel-button cancelButtonText="取消" confirmButtonText="确认">
      <div class="info">
        <div class="left">请输入实有人数</div>
        <div class="right">
          <van-stepper v-model="detailInfo.doneCount" min="0" max="100000" input-width=".4rem" integer />
        </div>
      </div>
    </van-dialog>
    <van-dialog v-model="dialogShow" @confirm="next" style="height:1.5rem"  show-cancel-button cancelButtonText="取消" confirmButtonText="确认">
      <div style="height:.5rem;line-height:.6rem;text-align:center;">生成后不可修改</div>
      <div style="height:.5rem;line-height:.3rem;text-align:center;">请确认内容正确无误后提交</div>
    </van-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "LookOver",
  data() {
    return {
      dialogShow: false,
      show: true,
      detailInfo:{},
      showType: false,
      showReport: false,
      doneCount: false,
      param:{},
      comfirmDoneType: '',
      type:''
    };
  },
  components: {},
  created() {

    // 从首页进入详情页还是从上一步进入详情页
    this.type = localStorage.getItem('in-type');
    this.showType = this.type == 'home' ? false : true;
    if (this.type == 'info') {
      this.param = JSON.parse(localStorage.getItem('addInfo'));
      this.getDetail();
    } else {
      this.param = JSON.parse(localStorage.getItem('addWorkInfo'));
      this.getHomeDetail();
    }
  },
  methods: {

    // 从上一页进来获取详情
    getDetail(){
      let param = {
        reportDate: this.param.reportDate,
        workTimeId: this.param.workTimeId,
        areaId:this.param.areaId
      }
      axios
        .fetch("careServer", "/carePatrolReport/report",param)
        .then((res) => {
          if (res.code == 200) {
            this.detailInfo = res.data;
            this.detailInfo.nextCarersList = this.detailInfo.nextCarers ? this.detailInfo.nextCarers.split(',') : [];
            this.detailInfo.currentCarersList = this.detailInfo.currentCarers ? this.detailInfo.currentCarers.split(',') : [];
            this.showReport = this.detailInfo.patrolReportDetails ? (this.detailInfo.patrolReportDetails.length == 0 ? false : true) : false;
          }
        });
    },
    reset(){
      this.doneCount = false;
      if(this.comfirmDoneType !== 'comfirm') {
         this.getDetail();
      }
    },
    editDone(){
      this.doneCount = this.type == 'info' ? true : false;
    },
    comfirmDoneCount(){
      this.detailInfo.doneCount = this.detailInfo.doneCount;
      this.doneCount = false;
      this.comfirmDoneType = 'comfirm';
    },
    
    // 从首页进来获取详情
    getHomeDetail(){
      const param = {
        id: this.param.id,
        isMyReport: false
      };
      axios.fetch("careServer", "/carePatrolReport/all", param).then((res) => {
        this.detailInfo = res.data[0];
        this.detailInfo.nextCarersList = this.detailInfo.nextCarers ? this.detailInfo.nextCarers.split(',') : [];
        this.detailInfo.currentCarersList = this.detailInfo.currentCarers ? this.detailInfo.currentCarers.split(',') : [];
        this.showReport = this.detailInfo.patrolReportDetails ? (this.detailInfo.patrolReportDetails.length == 0 ? false : true) : false;
        this.$forceUpdate();
      });
    },
    next(){
      let param = this.param;
      param.doneCount = this.detailInfo.doneCount || 0;
      param.itemCount = this.detailInfo.itemCount || 0;
      let url = '/carePatrolReport/add';
      axios
        .fetch("careServer", url,param,'json')
        .then((res) => {
          if (res.code == 200) {
            // 要添加的交班信息
            localStorage.removeItem('addInfo');
            this.$router.back();
          }
        });
    },
    back(){
      if (localStorage.getItem('in-type') == 'home') {
        this.$router.back();
      } else {
        this.$emit("changePage",0);
      }
    }
  },
};
</script>

<style lang="less" scoped>
.info{
  padding: .2rem;
  display: flex;
  align-items: center;
  .right{
    margin: 0 0 0 .1rem;
  }
}
.shift_content {
  height: 100%;
  display: flex;
  flex-direction: column;
  p {
    margin: 0;
  }
  .content {
    padding: 0.12rem 0.06rem;
    flex: 1;
    overflow: auto;
    .top {
      min-height: 0.2rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 0.12rem 0.1rem;
      .left {
        width: 30%;
        color: rgba(0, 0, 0, 0.4);
      }
      .right {
        width: 70%;
        color: #000;
        span{
          margin: 0 .05rem 0 0;
        }
      }
    }
    .data {
      margin: .1rem 0 0 0;
      padding: 0.12rem 0;
      background-color: #fff;
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
      .detail_data_all{
        flex-direction: row;
        li{
          width: 50%;
          display: flex;
          justify-content: center;
          p {
            font-size: 0.14rem;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.4);
          }
          p:nth-child(2) {
            line-height: 0.22rem;
            height: 0.22rem;
            font-size: 0.18rem;
            font-weight: 600;
            color: rgba(0, 0, 0, 1);
            margin-left: .1rem;
          }
          div{
            display: flex;
            align-items: center;
            height: .2rem;
            width: .9rem;
            margin: 0 0 0 .05rem;
          }
        }
      }
    }
    .main {
      flex: 1;
      // margin-top: 0.44rem;
      height: 100%;
      //   overflow: auto;
      .record {
        border-radius: 8px;
        margin-top: 0.12rem;
        // padding: 0.12rem 0.12rem 0 0.12rem;
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
          span.remark{
            background-color: #fff;
            color: #5bdc88;
            right: .3rem;
          }
          span.is-new{
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
        }
      }
    }
  }
  .bottom {
    margin-top: 0.12rem;
    padding: 0 0.08rem;
    background-color: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 0.56rem;
    button {
      border-radius: 0.08rem;
    }
    button + button {
      margin-left: 0.08rem;
    }
  }
}
</style>
