<template>
  <div class="check-register">
    <van-tabs v-model="active">
      <van-tab title="查房巡视">
        <Register :sign="'add'"></Register>
      </van-tab>
      <van-tab title="查看记录">
        <!-- 单人记录 -->
        <Record></Record>
      </van-tab>
    </van-tabs>
    <DatePicker :dateShow="dateShow" :type="'datetime'" @cancelFn="cancelFn" @confirmFn="confirmFn"></DatePicker>
  </div>
</template>

<script type="text/javascript">
import Record from "./single-record";
import Register from "../nurser/home/check-register";
import DatePicker from "@/components/datePicker";
export default {
  name: "CheckRegister",
  data() {
    return {
      dateShow: false,
      active: "",
      time: "", //巡视时间
    };
  },
  components: { Record, Register, DatePicker },
  created() {
    this.time = this.$moment().format("YYYY-MM-DD HH:mm");
  },
  beforeRouteEnter(to, from, next) {
    // console.log(from, "======");
    next((vm) => {
      if (from.path == "/orderly/check-register") {
        vm.active = 1;
      } else {
        vm.active = 0;
      }
    });
  },
  methods: {
    /** 时间选择事件 */
    confirmFn(data) {
      // 确定按钮
      this.time = this.$moment(data).format("YYYY-MM-DD HH:mm");
      // this.getListData();
      this.dateShow = false;
    },
    cancelFn() {
      this.dateShow = false;
    },
    // 显示模板
    showModules() {},
  },
};
</script>

<style lang="less" scoped>
.check-register {
  height: 100%;
  /deep/ .van-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    .van-tab__pane {
      height: 100%;
    }
    .van-tabs__content {
      // height: 100%;
      flex: 1;
      margin-bottom: 0.12rem;
      overflow: auto;
      .tabpanel {
        height: 100%;
      }
    }
    .van-tabs__line {
      background-color: #69ca8d;
    }
  }
}
</style>
