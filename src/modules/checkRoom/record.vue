<template>
  <div class="home_records">
    <div class="records_main">
      <Records :type="'home'"></Records>
    </div>
    <!-- <div class="records_bottom">
      <i @click="handleClick" class="iconfont icontubiao-jichutubiao-tianjia3x"></i>
    </div> -->
    <van-dialog v-model="dialogShow" @confirm="handleConfirm" class="error_dialog" title="选择班次" :show-confirm-button="false" show-cancel-button cancelButtonText="取消">
      <van-cell is-link v-for="(task,index) in tasks" :to="`check-room?taskId=${task.id}`" :key="index" :value="`${$moment(task.scheduleStart).format('HH:mm')}-${$moment(task.scheduleEnd).format('HH:mm')}`">
        <template #title>
          <div class="custom-title">{{task.areaName}}</div>
          <div>{{task.timeName}}</div>
        </template>
      </van-cell>
    </van-dialog>
  </div>
</template>

<script type="text/javascript">
import Records from "@/modules/nurser/home/check-records";
export default {
  name: "HomeRecords",
  data() {
    return {
      dialogShow: false,
      tasks: [], // 所有主任务
    };
  },
  components: {
    Records,
  },
  
  watch: {
    $route(newValue, oldValue) {
      console.log(newValue);
      this.dialogShow = false;
    },
  },
  methods: {
      // get turns
    handleClick() {
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
  },
};
</script>

<style lang="less" scoped>
.home_records {
  height: 100%;
  display: flex;
  flex-direction: column;
  .records_main {
    // height: calc(100% - 0.5rem);
    height: 100%;
  }
  .records_bottom {
    margin-top: 0.12rem;
    height: 0.5rem;
    background-color: #fff;
    text-align: center;
    position: relative;
    i {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      position: absolute;
      color: #fff;
      display: inline-block;
      font-size: 0.32rem;
      height: 0.6rem;
      width: 0.6rem;
      border-radius: 50%;
      background-color: #45c456;
    }
    .icontubiao-jichutubiao-tianjia3x:before {
      line-height: 0.6rem;
    }
  }
}
</style>
