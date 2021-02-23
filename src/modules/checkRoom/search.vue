<template>
  <!-- 搜索老人 -->
  <div class="search layout">
    <Back></Back>
    <div class="top">
      <van-search class="left" v-model="searchValue" @search="handleSearch" shape="round" placeholder="请输入老人姓名/房间号" />
      <div class="right" @click="handleSearch(searchValue)">
        搜索
      </div>
    </div>
    <div class="content">
      <Empty v-if="elders.length == 0" :imgUrl="imgUrl" :description="'暂无搜索结果'"></Empty>
      <ul class="elders_detail">
        <li @click="jump(elder)" v-for="(elder,i) in elders" :key="i">
          <i v-if="elder.new">新</i>
          <img :src="elder.elderPhoto?elder.elderPhoto:require('@/assets/img/icon-bed-default.png')" alt="">
          <div>
            <p>{{elder.elderName}}</p>
            <p style="margin:0;font-size:12px;color:rgba(0,0,0,.4)">{{elder.roomName}}-{{elder.bedName}}</p>
          </div>
        </li>
      </ul>
    </div>

    <van-dialog v-model="dialogShow" @confirm="handleConfirm" class="error_dialog" title="选择时间段" :show-confirm-button="false" show-cancel-button cancelButtonText="取消">
      <van-cell is-link v-for="(task,index) in tasks" @click="hanldeJump(task)" :key="index" :value="`${$moment(task.scheduleStart).format('HH:mm')}-${$moment(task.scheduleEnd).format('HH:mm')}`">
        <template #title>
          <div class="custom-title">{{task.areaName}}</div>
          <div>{{task.timeName}}</div>
        </template>
      </van-cell>
    </van-dialog>
    <bottom></bottom>
  </div>
</template>

<script type="text/javascript">
import Empty from "@/components/Empty";
export default {
  name: "Search",
  data() {
    return {
      dialogShow: false,
      searchValue: "",
      elders: [],
      imgUrl: require("../../assets/img/search_empty.png"),
    };
  },
  watch: {
    searchValue(newValue, oldValue) {
      if (!newValue) {
        this.elders = [];
      }
    },
  },
  components: { Empty },
  created() {},
  mounted() {
    document.getElementsByClassName("van-field__control")[0].focus();
  },
  methods: {
    searchElders(data) {
      axios
        .fetch("careServer", "/carePatrolItem/search/elder", {
          data,
        })
        .then((res) => {
          this.elders = res.data ? res.data : [];
        });
    },
    handleSearch(value) {
      if (value) {
        this.searchElders(value);
      } else {
        this.$toast("请输入关键词进行搜索");
      }
    },
    jump(data) {
      this.query = {};
      const query = {
        id: data.id,
        elderId: data.elderId,
        elderName: data.elderName,
        elderPhoto: data.elderPhoto,
        bedName: data.bedName,
        roomName: data.roomName,
        nursingLevel: data.nursingLevel,
        isNew: data.isNew,
      };
      this.query = query;
      this.getTurns(query);
    },
    // get turns
    getTurns() {
      axios.fetch("careServer", "/carePatrolItem/get/workTime").then((res) => {
        console.log(res);
        // this.turns = res.data ? res.data : [];
        // this.turn = this.turns[0].timeName;
        if (res.data && res.data.length > 0) {
          this.queryMainTask(
            this.$moment().format("YYYY-MM-DD"),
            res.data[0].startTime,
            res.data[0].endTime
          );
        }
      });
    },
    // query main task
    queryMainTask(date, startTime, endTime) {
      axios
        .fetch("careServer", "/carePatrolTask/get/byNowTime", {
          date,
          startTime,
          endTime,
        })
        .then((res) => {
          this.tasks = res.data && res.data.length > 0 ? res.data : [];
          console.log(this.tasks);
          this.dialogShow = true;
        });
    },
    hanldeJump(task) {
      this.query.taskId = task.id;
      this.query.timeName = `${this.$moment(task.scheduleStart).format(
        "HH:mm"
      )}-${this.$moment(task.scheduleEnd).format("HH:mm")}`;
      this.$router.push({
        path: "check-register",
        query: this.query,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@import "../../assets/styles/common.less";
.search {
  height: 100%;
  .top {
    .van-search {
      padding-right: 8px;
    }
    .right {
      font-size: 14px;
      color: #333333;
      font-weight: 600;
      width: 0.5rem;
      padding-top: 0;
      margin: 0;
      text-align: center;
      line-height: 0.48rem;
    }
  }
  .content {
    top: 0.48rem;
    background-color: #fff;
    .elders_detail {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      li {
        // flex: 1;
        box-shadow: 0 1px 6px 2px #f5f4f9;
        width: 20%;
        // height: 0.88rem;
        padding: 0.08rem 2.5%;
        text-align: center;
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: column;
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
}
</style>
